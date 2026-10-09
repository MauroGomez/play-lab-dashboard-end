# 5-1 · SQL Injection (SQLi)

Demostración de una inyección SQL de tipo **UNION-based** sobre el buscador de
películas, para leer datos de la tabla `users` (emails y hashes de contraseñas).

> ⚠️ El archivo [`model/data.ts`](./model/data.ts) contiene una versión
> **deliberadamente vulnerable** de `getFilteredMoviesData`. Es solo para el
> laboratorio: **nunca** se construye SQL concatenando input del usuario en
> producción.

## El payload

Pegar esto en el campo de búsqueda de la pantalla de películas:

```
' UNION SELECT id, name, email, password, 2024, role, 0, 0, 0, 'available' FROM users -- 
```

(ojo: hay un espacio después del `--`, PostgreSQL lo requiere)

Resultado: la tabla muestra las filas de `users` "disfrazadas" de películas —el
**nombre** en la columna Título, el **email** en Director y el **hash bcrypt** en
Género.

---

## Cómo funciona, paso a paso

### 1. Cómo es una consulta `SELECT` normal

La forma básica de pedir datos en SQL es:

```sql
SELECT columnas   -- qué columnas quiero
FROM tabla        -- de qué tabla
WHERE condición   -- qué filas (filtro)
```

En nuestra app, la búsqueda de películas arma algo así:

```sql
SELECT id, title, director, genre, release_year, rating, ...
FROM movies
WHERE title ILIKE '%loquebusco%'
```

- `ILIKE` = "parecido a", **sin** distinguir mayúsculas/minúsculas (la `I` es de *insensitive*).
- `%` es un **comodín**: significa "cualquier cosa, cero o más caracteres".
- Entonces `'%batman%'` matchea `"Batman Begins"`, `"THE BATMAN"`, etc.
- `'%'` solito matchea **todo** (cualquier texto). Guardá este dato, es clave para el ataque.

### 2. El problema: el texto del usuario se mete "crudo"

La versión vulnerable construye el SQL **pegando** lo que vos escribís directamente en el medio del texto:

```
WHERE title ILIKE '%  [TU TEXTO VA ACÁ]  %'
```

La base de datos no distingue "esto es dato" de "esto es comando": lee **todo el texto junto** como una sola instrucción. Ahí está la vulnerabilidad.

### 3. Las tres armas del payload

El payload es:

```
' UNION SELECT id, name, email, password, 2024, role, 0, 0, 0, 'available' FROM users --
```

Tiene tres piezas que hacen magia:

#### a) La comilla `'` → cierra el texto antes de tiempo

La consulta esperaba `'%...%'`. Vos metés una `'` al principio, y eso **cierra la comilla** que la app había abierto:

```
title ILIKE '%'
            └┬┘
     string que matchea TODO
```

A partir de ahí, lo que sigue **ya no es un dato buscado**: la base lo lee como **más SQL**. Te "escapaste" del campo de búsqueda.

#### b) `UNION SELECT ...` → pega los resultados de OTRA tabla

`UNION` es un operador que **apila** los resultados de dos consultas, una debajo de la otra:

```sql
SELECT ... FROM movies      -- consulta 1 (las películas)
UNION
SELECT ... FROM users       -- consulta 2 (¡los usuarios!)
```

El resultado es una sola tabla con las filas de ambas. Por eso los usuarios aparecen "disfrazados" de películas en pantalla.

**Regla de oro del `UNION`**: las dos consultas tienen que tener **la misma cantidad de columnas** y **tipos compatibles** (texto con texto, número con número). La de películas tiene 10 columnas, así que la de usuarios también necesita 10. Por eso el payload tiene:

| Posición | Columna de `movies` | Tipo | Qué puse yo |
|----------|---------------------|------|-------------|
| 1 | id | uuid | `id` (el id del user) |
| 2 | title | texto | `name` ← nombre del user |
| 3 | director | texto | `email` ← **email filtrado** |
| 4 | genre | texto | `password` ← **hash filtrado** |
| 5 | release_year | número | `2024` (relleno) |
| 6 | rating | texto | `role` |
| 7 | duration_minutes | número | `0` (relleno) |
| 8 | purchase_price | número | `0` (relleno) |
| 9 | rental_price | número | `0` (relleno) |
| 10 | status | texto | `'available'` (relleno) |

Los `2024`, `0` y `'available'` son **rellenos** para completar las 10 columnas con el tipo correcto. No me interesan esos valores; sólo necesito que la base no se queje por cantidad/tipo.

#### c) `--` → comenta el resto (lo "tacha")

En SQL, `--` significa "de acá hasta el fin de la línea, **ignorá todo**". Es un comentario.

¿Por qué lo necesito? Porque después de donde yo inyecté, la consulta original seguía con más cosas (`%' OR director ILIKE ...`, el `ORDER BY`, el `LIMIT`...). Si eso quedara ahí, rompería la sintaxis. Con `--` lo **tacho** para que la base lo ignore:

```
... FROM users  --  %' OR director ILIKE ... ORDER BY ... LIMIT 6
                 └──────────── todo esto queda ignorado ────────────┘
```

### 4. La consulta final que realmente se ejecuta

Juntando todo, lo que la base **realmente corre** es, en esencia:

```sql
SELECT id, title, director, genre, release_year, rating,
       duration_minutes, purchase_price, rental_price, status
FROM movies
WHERE title ILIKE '%'                          -- ← matchea TODAS las películas
UNION
SELECT id, name, email, password, 2024, role,  -- ← trae TODOS los usuarios
       0, 0, 0, 'available'
FROM users
-- %' OR director ILIKE ... (todo esto tachado)
```

Leído en voz alta: *"Traeme todas las películas, Y ADEMÁS, pegadas debajo, todas las filas de la tabla de usuarios con su nombre, email y contraseña."*

Por eso en pantalla aparece la fila del usuario `Editor` con su email en la columna "Director" y el hash bcrypt en "Genre".

---

## Resumen mental

1. **`'`** → me escapo del campo de búsqueda.
2. **`UNION SELECT ... FROM users`** → pego datos de otra tabla.
3. **`--`** → tacho lo que sobra para que no rompa.

Y la raíz de todo: la app **pegó tu texto crudo** dentro del comando en vez de
tratarlo como un simple dato.

## La defensa: consultas parametrizadas

La cura es **no concatenar** el input en el texto del SQL, sino pasarlo como
**parámetro**. Con la librería `postgres` eso se logra con el *tagged template*:

```ts
// SEGURO: el valor viaja como PARÁMETRO, nunca como texto del query
const movies = await sql<Movie[]>`
  SELECT id, title, director, genre, release_year, rating,
         duration_minutes, purchase_price, rental_price, status
  FROM movies
  WHERE title ILIKE ${`%${query}%`}
  ORDER BY title ASC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
`;
```

Con esto, el mismo payload deja de ser peligroso: la base busca una película que
se llame literalmente `' UNION SELECT ... --` y no encuentra nada. El `${...}` ya
**no** se interpreta como SQL, sino como un dato.

Otras defensas complementarias (defensa en profundidad):

- **Menor privilegio**: la cuenta de BD de la app no debería poder leer tablas que no necesita.
- **No exponer errores de BD** al cliente (dificulta descubrir y explotar la inyección).
- **Hashing fuerte de contraseñas** (bcrypt/argon2): aunque se filtre `users`, los hashes no se revierten fácilmente.
