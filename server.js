var express = require('express')
var server = express()
const PORT = process.env.PORT || 8080

server.get('/', (req, res) => {
  // server.use(express.static('/dist'))
  res.sendFile(__dirname + '/index.html')
})

server.get('/dist/build.js', (req, res) => {
  res.sendFile(__dirname + '/dist/build.js')
})

server.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + '/favicon.ico')
})

server.listen(PORT, () => {
  console.log('Vue.js server listening on port ' + PORT + ' !')
})
