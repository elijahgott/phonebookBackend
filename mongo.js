const mongoose = require('mongoose')
const Person = require('./models/person')

if(process.argv.length < 3){
    console.log('Please enter password.')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://elijah:${password}@cluster0.1h2zd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)


if(process.argv.length === 3){
    Person
        .find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
}
else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook.`, result)
        mongoose.connection.close()
    })
}

