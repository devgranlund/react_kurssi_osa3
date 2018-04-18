const express = require('express')
const app = express()
const bodyPareser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('request-data', function getRequestData (req, res) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(bodyPareser.json())
app.use(morgan(':method :url :request-data :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`<div>puhelinluettelossa ${persons.length} henkilön tiedot</div><br/>
                ${new Date()}`)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person
        .findById(id)
        .then(person => {
            response.json(Person.format(person))
        })
        .catch(error => {
            response.status(404).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    }
    if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    }
    Person
        .find({})
        .then(persons => {
            if(persons.find(person => person.name === body.name)){
                return response.status(400).json({error: 'name already exists'})
            }
            const person = new Person({
                name: body.name,
                number: body.number
            })

            person.save()
                .then(result => {
                    return response.json(Person.format(result))
                })
                .catch(error => {
                    console.log(error)
                })
        })        
        .catch(error => {
            console.log(error)
        })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  console.log(body)
  
  const person = {
      name: body.name,
      number: body.number,
      id: body.id
  }
  
  Person
      .findByIdAndUpdate(request.params.id, person, {new: true})
      .then(updatedPerson => {
          return response.json(Person.format(updatedPerson))
      })
      .catch(error => {
        console.log(error)
            return response.status(400).send({ error: 'malformatted id' })
        })
  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})