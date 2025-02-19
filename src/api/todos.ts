import axios from 'axios'

const fetchTodos = async (page?: number) => {
  const response = await axios.get('http://localhost:3001/todos?page=' + page)

  return response.data
}

const postTodo = async (newTodo: string) => {
  return await axios.post('http://localhost:3001/todos', {
    title: newTodo,
  })
}

const completeTodo = async (todoId: number) => {
  return await axios.put(`http://localhost:3001/todos/${todoId}`)
}

export { fetchTodos, postTodo, completeTodo }
