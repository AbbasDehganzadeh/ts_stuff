/* note.js
 */
const BTN_DEL_SOME = document.querySelector('#del-some')
const BTN_DEL_ALL = document.querySelector('#del-all')
const BTN_DEL_ONE = document.querySelector('#del-one')
const CHX_DEL = document.querySelectorAll('.del-chx')

const FORM = document.querySelector('.note-form')
const FORM_ERROR = document.querySelector('.error-form')
const FORM_SUBMIT = document.querySelector('.note-form button[type=submit]')
const TITLE_INPUT = document.querySelector('#title-inp')
const CONTENT_INPUT = document.querySelector('#content-inp')


/* Delete Actions */
BTN_DEL_ALL?.addEventListener('click', (e) => {
	const url = '/note/reset/' // -> 0 notes
	const ok = confirm('You will lost all your data!!')
	if (ok)
		fetch(url, {"method": "DELETE"})
})

BTN_DEL_SOME?.addEventListener('click', (e) => {
	let url = '/note/delete/' //
	const ids = Array()
	CHX_DEL.forEach(c=> {
		div = c.parentNode.parentNode
		if (c.checked ) {
			m=div.id.match(/(note-)?(?<id>[\d]+)$/)
			id = m.groups?.id
			ids.push(div.id)
			c.checked = false
	}})
	console.info({ids})
	if (ids.length) { // Any id;
	const ok = confirm('You will lost your data!')
		if (ok) 
			fetch(`${url}?ids=${ids.join(',')}`, {"method": "POST"})
	}
})

BTN_DEL_ONE?.addEventListener('click', (e) => {
	let url = '/note/delete/' //
	let id = undefined
	divs = document.querySelectorAll('div')
	for (const div of divs) {
		m=div.id.match(/(note-)?(?<id>[\d]+)$/)
		id = m.groups?.id
		console.log(id+'set')
		if (id != undefined) break
	}
	const ok = confirm('You will lost your datum!')
	if (ok) 
		fetch(`${url}?ids=${id}`, {"method": "POST"})
})


/* form handling */
FORM?.addEventListener('submit', (e) => {
	e.preventDefault() // Brake!

	const title = TITLE_INPUT.value
	const content = CONTENT_INPUT.value
	const formUrl = new URL(FORM.attributes[0].baseURI)
	let idd = '';let method = 'create'
	console.info({u:formUrl})
	if (formUrl.pathname.includes('update')) {
		idd = formUrl.search.slice(1) + '&' //? get id from url
		method = 'update'
	}

	const fetchUrl = `/note/${method}/?${idd}title="${title}"&content="${content}"`
	const targetUrl = `/note/?title="${title}"`

	fetch(fetchUrl, {"method": 'POST'}).then(resp => {
		if (!resp.ok) {
			console.info({resp})
			const err = resp.data
			FORM_ERROR.outerHTML = `<span>ERROR:\t${err}</span>`
			FORM_ERROR.classList.add('error-form') //! not-work
		} else {
			location.href = targetUrl
		}
		console.info({url:fetchUrl,rurl:targetUrl,title,content})
	})
})
