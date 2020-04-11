require('dotenv').config({ path: '../.env' })

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

morgan.token('type', (req, res) => req.headers['content-type'])
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type :body'))
app.use(express.json())
app.use(express.static('build'))
 
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes.map(note => note.toJSON()))
    })    
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note.toJSON())
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id))
//         :0    
//     return maxId + 1
// }

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(body.content === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    
    note.save().then(savedNote => {
        response.json(savedNote.toJSON())
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on  port ${PORT}`)
})