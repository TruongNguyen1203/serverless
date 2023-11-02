import { deleteTodo } from '../../businessLogic/todos.mjs'
import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
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

  const userId = getUserId(event)

    const deleteResult = await deleteTodo(todoId, userId)

    return {
      statusCode: 204
    }
  })
