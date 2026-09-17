const res = await fetch(
//   'https://streaming-demo.labs.vercel.dev/suspense-demo',
  'http://localhost:3001/dashboard/movies',
//   'http://localhost:3001/dashboard/movies?page=2&_rsc=3w44x',
  {
    headers: { 'Accept-Encoding': 'identity' },
  }
)
 
const reader = res.body.getReader()
const decoder = new TextDecoder()
let i = 0
const start = Date.now()
 
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(`\nchunk ${i++} (+${Date.now() - start}ms)\n`)
  console.log(decoder.decode(value))
}

// > node stream-observer.mjs | tee stream-output.txt
// URLs to test:
// - http://localhost:3001/dashboard/movies
// - http://localhost:3001/dashboard/movies?page=2&_rsc=3w44x
// Buscar "Loading..." y confirmar que viene en los primeros chunks, antes del delay.
// Buscar una de las películas del listado, por ejemplo Inception, y confirmar que viene 
// en los chunks tardíos (+10s)