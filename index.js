require('dotenv').config()

// Solo se requiere 1 sola ejecución para la conección al servidor.
require('./mongo')

const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')  // after database connection

// Middlewares imports
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')


const app = express()


// Accept requests from anywhere (backend)
app.use(cors())
// json-parser to get easy access to request.body
app.use(express.json())


// Morgan
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


// Base URL
app.get('/', (req, res) => {
    res.send('<h1>Phonebook Backend Home Page</h1>')
})

// INFO page using MongoDB
app.get('/info', (req, res, next) => {
    const date = new Date() 
    Person.find({}).then(contacts => {
        res.send(`
            <p>Phonebook has info for ${contacts.length} people</p>
            <p>${date}</p>
        `)
    }).catch(err => next(err))
})

// Get all using MongoDB
app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(contacts => res.json(contacts))
})

// Get 1 with id using MongoDB
app.get('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
        // sending to last USE: middleware to catch not Founds and 40- 40x errors
})

// Delete 1 using MongoDB
app.delete('/api/persons/:id', (req, res, next) => {
    const { id } = req.params

    // Search and Destroy - findByIdAndDelete
    Person.findByIdAndRemove(id)
        .then(() => res.status(204).end())
        .catch(err => next(err))
})

// Update 1 using MongoDB
app.put('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    const updatedContactData = req.body

    const contact = {
        name: updatedContactData.name,
        number: updatedContactData.number
    }

    // result will be the findById result (not the updated) by default
    Person.findByIdAndUpdate(id, contact, { new: true }).then(result => {
        res.status(200).json(result)
    }).catch(err => next(err))
})

// POST using MongoDB 
app.post('/api/persons', (req, res, next) => {
    const newData = req.body

    // No input Control
    if (!newData) {
        res.status(400).json({
            error: 'Unexpected error: No contact data'
        })
    } else if (!newData.name || !newData.number) {
        res.status(400).json({
            error: 'Name or Number is missing'
        })
    }

    // Already exists (update this with mongo database find)
    // const doesNotExist = persons.findIndex(p => p.name === person.name)
    
    // Trying find with mongo
    else {
        Person.exists({ name: newData.name }).then(contactFind => {
            if (contactFind) {
                console.log('Person already Exists', contactFind)
                res.status(400).json({
                    error: 'Name must be unique'
                })
            } else {
                // Add
                // Create ID: Not anymore since MongoDB creates its own IDs
                console.log("I shouldn't have entered here")
                // Create new Person/Contact
                const contact = new Person({
                    name: newData.name,
                    number: newData.number
                })
            
                console.log("I shouldn't be here neither")
                // Save Person/Contact
                contact.save().then(savedContact => {
                    res.status(201).json(savedContact)
                })
            }
        }).catch(err => next(err))
    }
})


// Middlewares
app.use(notFound)  // 404 NOT FOUND
app.use(handleErrors)  // Catch Errors


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})