const nodemon = require("nodemon")
const {Schema, model} = require('mongoose')

// Schema / Structure
const personSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{2,3}-?\d{6,7}\d*/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: [true, 'User phone number required']
    }
})

// Changing toJSON
// edit toJSON, for usage. No changes on the database value and settings
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Model
const Person = model('Person', personSchema)


//// Instance example
// const person = new Person ({
//     name: 'Austin',
//     number: 1234
// })
//// Saving
// person.save()
//     .then(result => {
//         console.log(result)
//         mongoose.connection.close()
//     })
//     .catch(err => {
//         console.error(err)
//     })


module.exports = Person