import { useState } from 'react'
import {
  useQuery,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Todo, ITodo } from '../components/Todo'
import { fetchTodos, postTodo } from '@/api/todos'

const todosQueryOptions = () =>
  queryOptions({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

export default function Home() {
  const [newTodo, setNewTodo] = useState('')

  const queryClient = useQueryClient()

  const query = useQuery(todosQueryOptions())
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
      queryClient.setQueryData(['todos'], data.data)
    },
  })

  const createTodo = (e) => {
    e.preventDefault()
    setNewTodo('')
    todosMutation.mutate(newTodo)
  }

  const {
    isPending,
    isFetching,
    isSuccess,
    isError,
    error,
    data,
    status,
    fetchStatus,
  } = query

  // console.log('Boolean states: ', isFetching, isPending, isSuccess, isError)
  // console.log('Data states: ', data, error)
  // console.log('Status states:', status, fetchStatus)

  if (isPending) return <>Loading...</>
  if (error) return <>Error!</>

  return (
    <div
      className="container sm mx-auto pt-32 text-4xl 
  font-mono bg-[url('/yt-header_sz.png')] 
  bg-[length:350px_90px] bg-no-repeat bg-top"
    >
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
      {data.map((todo: ITodo) => (
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
