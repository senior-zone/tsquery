import { useMutation } from '@tanstack/react-query'
import { ITodo } from './model'
import { completeTodo } from '@/api/todos'

export const Todo = (props: ITodo) => {
  const { title, completed, id } = props

  const todoCompleteMutation = useMutation({
    mutationFn: (todoId: number) => completeTodo(todoId),
  })

  const setTodoCompleted = () => {
    todoCompleteMutation.mutate(id)
  }

  return (
    <div className="flex justify-between p-4 m-2 border-solid border-4 border-gray-500 rounded">
      <div className={`max-w-3xl text-cyan-700 ${completed && 'line-through'}`}>
        {title}
      </div>
      {!completed && (
        <button
          onClick={setTodoCompleted}
          className="text-xl duration-300 hover:pb-2"
        >
          Complete
        </button>
      )}
    </div>
  )
}
