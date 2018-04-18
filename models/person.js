const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
    console.log('working in dev environment, using local env values')
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const Person = mongoose.model('Person', personSchema);

module.exports = Person