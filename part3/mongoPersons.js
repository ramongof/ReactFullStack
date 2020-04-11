const mongoose = require('mongoose')
const password = require('./mongoPassword');

if( process.argv.length < 3 )
{
    console.log('give password as argument')
    process.exit(1)
}

const name = process.argv[2]

const number = process.argv[3]

const url = `mongodb+srv://admin:${password}@cluster0-ofv6k.mongodb.net/person?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,    
})

const Person = mongoose.model('Person', personSchema)

if(name && number)
{
    //Insert
    const person = new Person({
        name: name,
        number: number,
        date: new Date(),    
    })

    person.save().then(response => {
        console.log('added', response.name, 'number', number, 'to phonebook')
        mongoose.connection.close()
    })
}
else{
    // SELECT
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
