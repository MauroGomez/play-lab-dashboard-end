## Next.js App Router Course - Final

This is the final template for the Next.js App Router Course. It contains the final code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

## Preparar la base de datos

Requiere Node.js 22.18 o superior (ejecución nativa de TypeScript).
Copiá `.env.example` a `.env` y completá las credenciales entregadas al grupo:

```dotenv
POSTGRES_DB_HOSTNAME=your-endpoint.neon.tech
POSTGRES_DB_USERNAME=grupo01
POSTGRES_DB_PASSWORD=your-password
```

Conservá también `AUTH_SECRET` y `AUTH_URL` para la autenticación.
La aplicación y el setup usan estas mismas variables; `POSTGRES_URL` ya no se utiliza.
El usuario debe tener el formato `grupoNN` y permiso `CREATEDB`.

```bash
npm run db:setup
npm run dev
```

**Cada ejecución de `db:setup` elimina la BD del grupo y todos sus datos,
cierra sus conexiones activas y la recrea con los datos iniciales.**
Por ejemplo, `grupo01` utiliza `db-play-lab-grupo01`. Si la base existente
pertenece a otro usuario, el script se detiene sin borrarla.

El setup se conecta primero a `neondb` para crear la base y revocar `CONNECT`
de `PUBLIC`. Luego se conecta a la base del grupo y crea las tablas y carga
los datos en una transacción. Los roles de los alumnos deben ser los creados
por `db-admin`, sin membresía administrativa ni permisos sobre otros grupos.
Si falla la carga, corregí el problema y repetí el comando.

El script y los datos están en `scripts/setup/`. La ruta HTTP `/seed` fue eliminada.
Los nombres de las tablas actuales se conservan.
