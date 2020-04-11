require('dotenv').config({ path: '../.env' })

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('type', (req, res) => req.headers['content-type'])
morgan.token('id', (req, res) =>  req.params.id)
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type :body :id'))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.get('/', (request, response) => {    
    response.send('<h1>Phone Book2</h1>')
})

app.get('/info', (request, response) => {        
    const date = new Date()
    Person.find().then(persons => {
        response.send(`<div>Phone Book2 has info for ${persons.length} people</div>
    <div>${date.toUTCString()}</div>`)
    })
})

app.get('/api/persons', (request, response) => {   
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })    
})

app.get('/api/persons/:id', (request, response, next) => {    
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }            
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }    
    Person.findByIdAndUpdate(request.params.id, person)
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // const eName = Person.find(p => p.name === body.name)
    // const eNumber = Person.find(p => p.number === body.number)
    
    // if(!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: 'content missing'
    //     })
    // }
    // else if(eName){
    //     return response.status(400).json({
    //         error: 'This name was already registered'
    //     })
    // }
    // else if(eNumber)
    // {
    //     return response.status(400).json({
    //         error: 'This number was already registered'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error)
    
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on  port ${PORT}`)
})
