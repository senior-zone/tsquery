const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

let todos = require('./data')

const port = 3001
let queryId = todos.length

app.use(cors())
app.use(bodyParser.json())

app.get('/todos', (req, res) => {
  res.send(todos)
})

app.post('/todos', (req, res) => {
  setTimeout(() => {
    if (Math.random() > 0.4) {
      todos = [
        {
          id: ++queryId,
          completed: false,
          title: req.body.title,
        },
        ...todos,
      ]

      res.status(201)
      res.send(todos)
    } else {
      res.status(500)
      res.send({
        error: {
          message: 'Failed',
        },
      })
    }
  }, 900)
})

app.put('/todos/:id', (req, res) => {
  todos.find((todo) => todo.id === Number(req.params.id)).completed = true
  res.status(200)
  res.send(todos)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
