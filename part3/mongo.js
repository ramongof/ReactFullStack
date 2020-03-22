const mongoose = require('mongoose')

if( process.argv.length < 3 )
{
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0-ofv6k.mongodb.net/node-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// //Insert
// const note = new Note({
//     content: 'NoSQL databases became very popular with modern programming',
//     date: new Date(),
//     important: false,
// })

// note.save().then(response => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

// SELECT
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})

// // SELECT IMPORTANT
// Note.find({ important: true }).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })