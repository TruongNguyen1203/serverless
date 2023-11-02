import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import * as uuid from 'uuid'
import createError from 'http-errors'
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

const todosAccess = new TodosAccess()
const bucketName = process.env.TODOS_S3_BUCKET

export async function getTodosByUserId(userId) {
  return todosAccess.getTodosByUserId(userId)
}

export async function createTodo(request, userId) {
  const id = uuid.v4()

  const newItem = {
    todoId: id,
    userId: userId,
    name: request.name,
    dueDate: request.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  }

  await todosAccess.createTodo({ ...newItem })

  return newItem
}

export async function updateTodo(request, todoId, userId) {
  await isTodoExist(todoId, userId)

  return await todosAccess.updateTodo(request, todoId, userId)
}

export async function isTodoExist(id, userId) {
  const items = await getTodosByUserId(userId)

  const isExist = items.some((x) => x.todoId === id)
  if (!isExist) {
    throw createError(
      404,
      JSON.stringify({
        error: 'Todo doest not exist'
      })
    )
  }
}

export async function deleteTodo(todoId, userId) {
  await isTodoExist(todoId, userId)

  return await todosAccess.deleteTodo(todoId, userId)
}

export async function getUploadUrls(todoId, userId) {
  await isTodoExist(todoId, userId)

  return await getUploadUrl(todoId)
}

export async function updateAttachmentUrl(url, todoId, userId) {
  await isTodoExist(todoId, userId)

  return await todosAccess.updateAttachmentUrl(url, todoId, userId)
}
