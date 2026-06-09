/*
 * note:router
 */
const {page404,page500} = require("../helper/responses")
const handler = require("./handler")


function router(req, res) {
  if (req.url == '/note/')
    // if (req.method == "GET")
      return handler.showList(req, res)
  if (req.url.match(/^\/note\/\?title=(.*)/))
    // if (req.method == "GET")
      return handler.showNote(req, res)
  if (req.url.match(/^\/note\/create\/(\?(title|content)=(.*))*/)) {
    if (req.method == "GET")
      return handler.showForm(req, res)
    if (req.method == "POST")
      return handler.addNote(req, res)
    return page404(req, res, {ref_link:'/note/'})
  }
  if (req.url.match(/^\/note\/update\/(\?(id|title|content)=(.*))*/)) {
    if (req.method == "GET")
      return handler.showEdit(req, res)
    if (req.method == "POST")
      return handler.amendNote(req, res)
    return page404(req, res, {ref_link:'/note/'})
  }
  if (req.url.match(/^\/note\/delete\/\?ids=\d+(,\d+)*/)) {
    if (req.method == "POST")
      return handler.destroyNotes(req, res)
    return page404(req, res, {ref_link:'/note/'})
  }
  if (req.url == '/note/reset/') {
    if (req.method == "DELETE")
      return handler.resetNote(req, res)
    return page500(req, res, {error:'default error'})
  }
  return page404(req, res, {ref_link:'/hi'})
}

module.exports = router
