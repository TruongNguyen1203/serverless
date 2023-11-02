import { updateTodo } from '../../businessLogic/todos.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credential: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event :>> ', event)

    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    const userId = getUserId(event)

    const updatedItem = await updateTodo(updatedTodo, todoId, userId)

    return {
      statusCode: 202
    }
  })
