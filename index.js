require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))
app.use(cors())

const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
app.use(requestLogger)

morgan.token('type', function (req, res) { 
    console.log("REQ ", req)
    console.log("RES ", res)
    return req.headers['content-type'] 
})



/* let persons = [
    {
      id: 1,
      name: "sydney fox",
      number: "12312"
    },
    {
      id: 2,
      name: "indiana jones",
      number: "455465757"
    },
    {
      id: 3,
      name: "dolly",
      number: "34523"
    },
    {
        id: 4,
        name: "johnny",
        number: "551315"
      }

  ] */



  //get all
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
   })

  })
//infopage
  app.get('/api/persons/info', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</> `)
   })
    
  })

  // get one
  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
 
  })

  //remove person
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  //add person
  const generateId = () => {
    id = Math.ceil(Math.random()*1000);

   return id
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body

  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'number or name is missing' 
      }).end()
    } else  {
      Person.find({}).then(persons => {
      /*   response.json(persons) */
        console.log("PERSONS: "+persons)
        if(persons.some(person => person.name === body.name)){

          response.status(400).json({error:"name not unique"}).end()
      } else {
        console.log("construction person")
        const person = new Person({
          name: body.name,
          number: body.number,
          id: generateId(),
        })
        person.save().then(savedPerson => {
          console.log("saving person")
          response.json(savedPerson)
          })

      }
        
     })
 

     
    

    }
/*     if(persons.some(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    } */
  
    
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)




  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })