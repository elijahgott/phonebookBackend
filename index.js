const express = require('express');
const app = express();

const morgan = require('morgan');

app.use(express.json());
app.use(express.static('dist'));
app.use(morgan('tiny'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find((person) => person.id === id);
    if(person){
        response.json(person);
    }
    else{
        response.status(404).end();
    }
})

app.get('/info', (request, response) => {
    const currentDate = new Date().toLocaleString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    response.send(`
        <h1>Phonebook has info for ${persons.length} people.</h1>
        <p>${currentDate} (${timeZone})</p>`);
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name){
        return response.status(400).json({
            error: 'Name missing.'
        });
    }
    else if(!body.number){
        return response.status(400).json({
            error: 'Number missing.'
        });
    }
    else if(persons.find((person => person.name === body.name))){
        return response.status(400).json({
            error: 'Name already exists in phonebook.'
        });
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * (1000 - 10) + 10)
    }

    persons = persons.concat(newPerson);
    response.json(newPerson);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})