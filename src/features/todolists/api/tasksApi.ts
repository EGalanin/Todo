import { instance } from "common/instance"
import { BaseResponse } from "common/types"
import { baseApi } from "../../../app/baseApi"
import { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"

export const PAGE_SIZE = 4

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; args: { page: number } }>({
      query: ({ todolistId, args }) => {
        const params = { ...args, count: PAGE_SIZE }
        return {
          url: `todo-lists/${todolistId}/tasks`,
          params,
        }
      },
      providesTags: (res, err, { todolistId }) =>
        res
          ? [
              ...res.items.map((TASK) => {
                return { type: "Task", id: TASK.id } as const
              }),
              { type: "Task", id: todolistId },
            ]
          : ["Task"],
    }),
    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => {
        return {
          method: "POST",
          url: `todo-lists/${todolistId}/tasks`,
          body: {
            title,
          },
        }
      },
      invalidatesTags: (res, err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),
    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => {
        return {
          method: "DELETE",
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
        }
      },
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => {
        return {
          method: "PUT",
          url: `todo-lists/${todolistId}/tasks/${taskId}`,
          body: model,
        }
      },
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi

export const _tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { title: string; todolistId: string }) {
    const { title, todolistId } = payload
    return instance.post<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks`, { title })
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { taskId, todolistId } = payload
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(payload: { todolistId: string; taskId: string; model: UpdateTaskModel }) {
    const { taskId, todolistId, model } = payload
    return instance.put<BaseResponse<{ item: DomainTask }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}