const express = require('express');
const { sign, verify } = require('jsonwebtoken');
const PORT = process.env.PORT || 3016
secret_key = 'jwt-secret'; // ! NOTE: It should not be included in the source code

const app = express();
app.use(express.json())

const users = [ // test users in memory
    { id: 1, name: 'John', password: 'doe' },
    { id: 2, name: 'Jane', password: 'done' }
]

app.post('/login', (req, res) => { // login route
    // get user credentials, validate, and send the token
    const { username, password } = req.body
    const user = users.find(
        u => u.name === username && u.password === password
    ); console.log('user', user)
    if (!user) { res.status(401).send("Unauthorized access"); return }
    const token = sign({ userId: user.id }, secret_key, {expiresIn:120})
    res.status(202).json({ token})
})

app.get('/pro', (req, res) => { // protected route
    const token = req.headers.authorization
    const auth_token = token.split(' ')[1]
    // console.log(token,'token', auth_token )
    try {
        const decoded_token = verify(auth_token, secret_key)
        const userId = decoded_token.userId
        const user = users.find(u => u.id === userId)
    if(user.id === userId) {
    res.status(200).send({ "ID": user.id, "Name": user.name })
    // console.info(`Token ${token} verified: \t`); return
}
res.status(401).send({ "message": "Unauthorized user!" })} catch (err) {
    // console.error('Unauthorized user', err);
    res.status(400).json({ "message": "Invalid token" })
}})

app.delete('/logout', (req, res) => { // log out route
    // expire the token, and redirect to login route
    res.status(204).send()
})

app.get('/', (req, res) => { res.send({ "message": "hello world!" }) });

app.listen(PORT, () => { // running server
    console.log(`The server is listening on ${PORT}.`);
})
