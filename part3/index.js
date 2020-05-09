/* eslint-disable no-unused-vars */
require('dotenv').config({ path: '.env' })

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const ErrorHandler = require('./models/errorHandling')

morgan.token('type', (req, res) => req.headers['content-type'])
morgan.token('id', (req, res) =>  req.params.id)
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type :body :id'))

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

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      updatedPerson ? response.json(updatedPerson.toJSON()) : response.status(400).send({ error: 'ID already deleted!' })
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  })

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.use(ErrorHandler.unknownEndpoint)
app.use(ErrorHandler.errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on  port ${PORT}`)
})
