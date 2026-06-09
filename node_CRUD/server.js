/* server.js
 * main file for node.js server.
 */

const http = require("http")
const resp = require("./helper/responses")
const noteRouter = require("./note/router")


const PORT = 3006

// base web server
const server = http.createServer((req,res) => {
  console.info(req.method,req.url)
  if (req.url == '/hi') res.end("Hi!!")
  if (/\/(css|js)\/.*/.test(req.url) && req.method == "GET") {
    const path = req.url.slice(1)
    return resp.render(req,res,path)
  }
  return noteRouter(req, res)
  // res.end("not found !")
})

// server set-up
server.listen(PORT)
console.info(`Server listens on Port ${PORT}`)
