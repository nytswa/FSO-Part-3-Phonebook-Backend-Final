const mongoose = require('mongoose')
const Person = require('./models/Person.js')
// const password = require('./password.js')

// connection string
// const connectionString = `mongodb+srv://user_test:${password}@cluster0.ynlmk74.mongodb.net/?retryWrites=true&w=majority`
const connectionString = process.env.MONGODB_URI


// connection mongodb - returns a promise
mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connected')
    })
    .catch(err => {
        console.error(err)
    })


module.exports = mongoose