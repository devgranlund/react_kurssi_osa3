const express = require('express')
const app = express()
const bodyPareser = require('body-parser')

app.use(bodyPareser.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div>puhelinluettelossa ${persons.length} henkilön tiedot</div><br/>
                ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(perz => perz.id === id)
    if ( person ) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined) {
        return response.status(400).json({error: 'name missing'})
    }
    if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    }
    if (persons.filter(person => person.name === body.name).length > 0){
        return response.status(400).json({error: 'name already exists'})
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    persons = persons.concat(person)
    
    response.json(person)
})

const generateId = () => {
    const id = Math.floor(Math.random() * Math.floor(100000));
    if (persons.filter(person => person.id === id).length > 0){
        console.log('id ', id, ' already exists, generating new')
        return generateId()
    } else {
        return id
    }
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})