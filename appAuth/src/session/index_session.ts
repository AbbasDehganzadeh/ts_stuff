import express from 'express';
import session from 'express-session';
import { config } from 'dotenv';
import { Request, Response } from "express";

const app = express();
config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session( // session object middleware
    {
        secret: process.env.SECRT_KEY || 'secret',
        resave: false,
        saveUninitialized: false
    }
));

type User = { id: number, name: string, password: string }
type UserId = Pick<User, 'id'>
// test users in memory
let users: User[] = [
    { id: 1, name: 'John', password: "doe" },
    { id: 2, name: 'Josh', password: "deo" }

]
let b_listUsers: UserId[] = [] // blocked users [It just stores id of users]

app.post('/login', (req: Request, res: Response) => { // login route
    const { username, password } = req.body
    const user = users.find(
        u => username === u.name && password === u.password);
    console.debug(req.body, user)
    if (!user) { res.status(401).send("Unauthorized access"); return }
    if (b_listUsers.includes(user)) { res.status(403).send("Unaccessible user"); return }
    req.session!!.userId = user.id
    res.status(202).send({ "id": user.id, "name": user.name })
})

app.post('/logout', (req: Request, res: Response) => { // log out route
    req.session?.destroy(() => {
        res.status(204).send("You are successfully logged out")
    })
})

app.get('/pro', (req: Request, res: Response) => { // protected route
    // Authorization using the session request
    const userId = req.session?.userId
    if (userId) {
        const user = users.find(u => u.id === userId)
        if (b_listUsers.includes(user as UserId)) { res.status(403).send("Unaccessible user"); return }
        res.status(200).send({ "ID": userId, "Name": user?.name, "pass": user?.password })
    } else {
        console.warn(`User ${userId} not found`)
        res.status(400).send("Oops! User not found")
    }
})

app.get("/blocks", (req: Request, res: Response) => { // block user route
    const userId = req.params.user
    const user = users.find(u => u.id === Number(userId))
    if (!user) { res.status(400).send("User not found"); return }
    b_listUsers.push({ id: user.id })
    res.send("user blocked!")
})

app.get("/", (req: Request, res: Response) => { // root route
    res.send({ "Hello": "World!" })
})
app.listen(3015, () => { // running server
    console.log('listening on http://localhost:3015');
})
