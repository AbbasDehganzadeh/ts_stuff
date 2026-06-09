/*
 * a helper module for response to client.
 */
const fs = require("fs")
const {HTMLParser} = require("./parsers")


const MIME_TABLE = {
  'html': "text/html",
  'css': "text/css",
  'js': "text/javascript",
}

function render(req, res, fname, ctx, status) {
  const prs = new HTMLParser(ctx)
  const type = MIME_TABLE[fname.split('.').pop()] || 'text/plain'
  res.writeHead(status || 200, {"Content-Type": type})
  const name = `${process.cwd()}/public/${fname}`
  console.info({type,name})

  const reader = fs.createReadStream(name)
  reader.on("error", (e)=> {
    res.writeHead(404, {"Content-Type":"text/plain"})
    res.end("Not F~ound!")
  })
  reader.on('data', (d)=> {
    if (type == 'text/html')
      txt = prs.parse(d.toString())
    else txt = d.toString()
    res.write(txt)
  })
  reader.on('end', () => res.end())
}

function page404(req,res,ctx) {
  return render(req,res,'html/404.html',ctx,404)
}

function page500(req,res,ctx) { 
  return render(req,res,'html/500.html',ctx,500)
}

module.exports = {
  render,
  page404,
  page500,
}