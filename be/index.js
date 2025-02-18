const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

let todos = require('./data')

const port = 3001

app.use(cors())
app.use(bodyParser.json())

app.get('/todos', (req, res) => {
  res.send(todos)
})

app.post('/todos', (req, res) => {
  const newId = todos[todos.length - 1].id + 1

  todos = [
    {
      userId: 1,
      id: newId,
      completed: false,
      title: req.body.title,
    },
    ...todos,
  ]

  res.status(201)
})

app.put('/todos/:id', (req, res) => {
  todos.find((todo) => todo.id === Number(req.params.id)).completed = true
  console.log(todos)
  res.status(200)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
