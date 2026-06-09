/*
 * note:handler
 */
const {render, page500} = require("../helper/responses")
const model = require("./models")

BASE_URL = 'http://'+'localhost:3006' // host url


function strip(value, char) {
  if (value.startsWith(char) && value.endsWith(char))
    return value.slice(1, value.length-1)
  return value
}


function showList(req,res) {
  notes = new model.Note().findAll()
  console.info({notes})
  return render(req,res,"html/note/list.html", {notes, auth:'abbas80'})
}

function showNote(req,res) {
  const {searchParams:query} = new URL(BASE_URL+req.url)
  let title = query.get('title')
  title = strip(title, '"')
  note = new model.Note().findByTitle(title)
  console.info({query,note})
  return render(req,res,"html/note/detail.html", {note})
}

function showForm(req,res) {
  return render(req,res,"html/note/form.html")
}

function showEdit(req,res) {
  const {searchParams:query} = new URL(BASE_URL+req.url)
  const id = parseInt(strip(query.get('id'),'"'))
  note = new model.Note().findById(id)
  console.info({query,id,note})
  if (note && note.id != undefined)
    return render(req,res,"html/note/edit.html", {note})
  return render(req,res,"html/note/form.html")
}

function addNote(req,res) {
  const {searchParams:query} = new URL(BASE_URL+req.url)
  let title = query.get('title')
  let content = query.get('content')
  title = strip(title, '"')
  content = strip(content, '"')
  console.info({query,title,content})
  try {
    const note = new model.Note(title, content).insert()
    console.info({note})
    return res.end("Note Created.\t"+{note})
  } catch (e) {
    console.info({e})
    return page500(req, res, {error:e})
  }
}

function amendNote(req,res) {
  const {searchParams:query} = new URL(BASE_URL+req.url)
  const id = parseInt(strip(query.get('id'),'"'))
  let title = query.get('title')
  let content = query.get('content')
  title = strip(title, '"')
  content = strip(content, '"')
  console.info({query,id,title,content})
  try {
    const note = new model.Note(title, content).update(id)
    console.info({note})
    return res.end("Note Updated.\t"+{note})
  } catch (e) {
    console.info({e})
    return page500(req, res, {error:e})
  }
}

function destroyNotes(req,res) {
  const {searchParams:query} = new URL(BASE_URL+req.url)
  const ids = query.get('ids').split(',')

  ids.forEach(id => {
    try {
      new model.Note().delete(id)
    } catch (e) {
    console.info({e})
    return page500(req, res, {error:e})
    }
  })
  console.info({ids})
  return res.end(ids.length +" Note Deleted.\t")
}

function resetNote(req,res) {
  new model.Note().reset()
  return res.end("Note Reset.")
}

module.exports = {
  showList,
  showNote,
  showForm,
  showEdit,
  addNote,
  amendNote,
  destroyNotes,
  resetNote
}
