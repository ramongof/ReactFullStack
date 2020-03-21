console.log('Phone Book2')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('type', (req, res) => req.headers['content-type'])
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type :body'))
app.use(express.json())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,        
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 3,
    }
]

app.get('/', (request, response) => {    
    response.send('<h1>Phone Book2</h1>')
})

app.get('/info', (request, response) => {
    const total = persons.length
    const date = new Date()
    response.send(`<div>Phone Book2 has info for ${total} people</div>
                   <div>${date.toUTCString()}</div>`)
})

app.get('/api/persons', (request, response) => {   
    console.log(request.url)     
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }    
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        :0    
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const eName = persons.find(p => p.name === body.name)
    const eNumber = persons.find(p => p.number === body.number)
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    else if(eName){
        return response.status(400).json({
            error: 'This name was already registered'
        })
    }
    else if(eNumber)
    {
        return response.status(400).json({
            error: 'This number was already registered'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    
    persons = persons.concat(person)    

    response.json(person)
})

const PORT = precess.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on  port ${PORT}`)
})
