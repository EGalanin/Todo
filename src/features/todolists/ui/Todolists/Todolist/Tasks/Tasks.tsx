import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { useState } from "react"
import { useGetTasksQuery } from "../../../../api/tasksApi"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { TasksPagination } from "../TasksPagination/TasksPagination"
import { Task } from "./Task/Task"
import { DomainTodolist } from "features/todolists/ui/Todolists/lib/types/types"
import { useTasks } from "features/todolists/ui/Todolists/lib/hooks/useTasks"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {

  const { tasks, isLoading, totalCount, page, setPage } = useTasks(todolist)

  // const [page, setPage] = useState(1)
  //
  // const { data, isLoading } = useGetTasksQuery({ todolistId: todolist.id, args: { page } })
  //
  // let tasksForTodolist = data?.items
  //
  // if (todolist.filter === "active") {
  //   tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
  // }
  //
  // if (todolist.filter === "completed") {
  //   tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
  // }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {tasks?.map((task) => {
              return <Task key={task.id} task={task} todolist={todolist} />
            })}
          </List>
          <TasksPagination totalCount={totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
