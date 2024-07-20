const express = require("express")

const app = express()

app.get('', (req, res) => {
  res.send('<span>message: hello world!</span>')
})

app.listen(3003, () => console.info('server has been started.'))
