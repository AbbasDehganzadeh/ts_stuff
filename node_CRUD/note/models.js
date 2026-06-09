/*
 * note:model
 */
/* absolute persist DB */
let id = 0
let notes = [
  {"id":id, "title":"How to...", "content":"I wanna show ya!"},
]

class Note{
  id = 0
  title = ''
  content = ''

  constructor(title,content) {
    this.title = title
    this.content = content
  }

  findAll() {
    return notes // all data
  }

  findById(id) {
    return notes.find(o => o.id == id)
  }

  findByTitle(value) {
    return notes.find(o => o.title == value)
  }

  findBy(key,value) {
    return notes.filter(o =>
      o[key] == value || String(o[key]).includes(value))
  }

  insert() {
    const {title, content} = this
    this.validNote(title, content)
    const note = {id:++id, title, content}
    notes.push(note)
    return note
  }

  update(id) {
    const note = notes.find(o => o.id == id)
    const {title, content} = this
    this.validNote(title, content)
    if (note) {
      if (title) note.title = title
      note.content = content
    } else
      note = {id:++id, title, content}
    notes = [...notes.filter(o => o.id != id), note]
    console.log({notes})
    return note
  }

  delete(id) {
    notes = notes.filter(o => o.id != id)
  }

  validNote(title, content) {
    if (!title.length) {
      throw "`title` must not be EMPTY"
    }
    if (/[^\w\s-_,.!?]/.test(title)) {
      throw "`title` has invalid character"
    }
    const note = notes.find(o => o.title == title)
    if (note) {
      throw "note with DUPLICATE 'title' " + title
    }
  }

  reset() {
    notes = notes.filter(o => o.title == '')
  }
}

exports.Note = Note
