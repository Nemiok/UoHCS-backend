
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let numbers = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.use(cors())
app.use(express.json())

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/numbers', (request, response) => {
  response.json(numbers)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${Object.keys(numbers).length} people</p>
  <div>${new Date()}</div>`)
})

app.get('/api/numbers/:id', (request, response) => {
  const id = +request.params.id
  const number = numbers.find(number => number.id === id)

  if (number) {
    response.json(number)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/numbers/:id', (request, response) => {
  const id = Number(request.params.id)
  numbers = numbers.filter(number => number.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const num = Math.random()
  return Math.trunc(num * 10000000)
}

app.post('/api/numbers', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (numbers.findIndex(number => number.name === body.name) !== -1) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const number = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  numbers = numbers.concat(number)

  response.json(number)
})
