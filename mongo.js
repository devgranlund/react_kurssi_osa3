const mongoose = require('mongoose')
const args = process.argv.slice(2);
const url = process.env.MONGODB_URI
mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})
console.log('4')


if (args.length === 2 ) {
    const person = new Person({
        name: args[0],
        number: args[1]
    })
    console.log('5')

    person
        .save()
        .then(response => {
            console.log('lisätään henkilö ', args[0], ' numero ', args[1], ' luetteloon')
            mongoose.connection.close()
        })
    console.log('6')

} else {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
}
