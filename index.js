require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');

const morgan = require('morgan');

app.use(express.json());
app.use(express.static('dist'));
app.use(morgan('tiny'));

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        });
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            }
            else{
                response.status(404).end();
            }
        })
        .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body;

    Person.findById(request.params.id)
        .then(person => {
            if(!person){
                return response.status(404).end();
            }

            person.name = name;
            person.number = number;

            return person.save()
                    .then((updatedPerson) => {
                        response.json(updatedPerson)
                    })
        })
        .catch(error => next(error));
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    Person.find({}).then(persons => {
        response.send(`
            <h1>Phonebook has info for ${persons.length} people.</h1>
            <p>${currentDate} (${timeZone})</p>
        `);
    });

    
})

app.post('/api/persons', (request, response) => {
    const {name, number} = request.body;
    console.log(name, number);

    if(!name){
        return response.status(400).json({
            error: 'Name missing.'
        });
    }
    else if(!number){
        return response.status(400).json({
            error: 'Number missing.'
        });
    }
    // else if(Person.find({name: name})){
    //     console.log('exists')
    //     return response.status(400).json({
    //         error: 'Name already exists in phonebook.'
    //     });
    // }

    const newPerson = new Person({
        name: name,
        number: number
    })

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson);
        });
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
           response.status(204).end();
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted ID'});
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})