const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('url: ', url)

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})

module.exports = Person