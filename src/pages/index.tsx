import { useState } from 'react'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { Todo, ITodo } from '../components/Todo'
import { fetchTodos, postTodo } from '@/api/todos'

export default function Home() {
  const [newTodo, setNewTodo] = useState('')
  const [page, setPage] = useState(1)

  const queryClient = useQueryClient()

  const todosQueryOptions = () =>
    queryOptions({
      queryKey: ['todos', page],
      queryFn: () => fetchTodos(page),
      placeholderData: keepPreviousData,
    })

  const { isPending, error, data, isPlaceholderData } =
    useQuery(todosQueryOptions())

  console.log(isPlaceholderData)

  const todosMutation = useMutation({
    mutationFn: postTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos: ITodo[] = queryClient.getQueryData(['todos'])

      const optimisticTodos: ITodo[] = [
        {
          id: 12398,
          title: newTodo,
          completed: false,
        },
        ...previousTodos,
      ]

      queryClient.setQueryData(['todos'], optimisticTodos)

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos)
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(['todos'], data.data.todos)
    },
  })

  const createTodo = (e) => {
    e.preventDefault()
    setNewTodo('')
    todosMutation.mutate(newTodo)
  }

  if (isPending) return <>Loading...</>
  if (error) return <>Error!</>

  return (
    <div
      className="container sm mx-auto pt-32 text-4xl 
  font-mono bg-[url('/yt-header_sz.png')] 
  bg-[length:350px_90px] bg-no-repeat bg-top"
    >
      <div className="flex m-2 justify-between">
        <div className="flex">
          <button
            onClick={() => setPage((page) => page - 1)}
            disabled={page === 1}
          >
            {'\u2190'}
          </button>
          <button
            onClick={() => setPage((page) => page + 1)}
            disabled={isPlaceholderData || !data?.hasMore}
          >
            {'\u2192'}
          </button>
        </div>
        <div>Current page: {page}</div>
      </div>
      <form onSubmit={createTodo} className="flex justify-center m-2 gap-2">
        <input
          name="todoName"
          className="flex-auto border-solid border-2 border-gray-500 rounded-xs"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          type="submit"
          className="text-xl p-2 border-solid border-2 border-gray-500 rounded-xs"
        >
          Create todo
        </button>
      </form>
      {/* {todosMutation.isPending && <>Pending...</>} */}
      {/* {todosMutation.isPending && <>{todosMutation.variables}</>} */}
      {data.todos.map((todo: ITodo) => (
        <Todo
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
        />
      ))}
    </div>
  )
}
