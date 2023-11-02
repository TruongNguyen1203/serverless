import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'

export const handler = middy()
  .use(
    cors({
      credential: true
    })
  )
  .handler(async (event) => {
    console.log('Proccessing event: ', event)
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    const item = await createTodo(newTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({ item })
    }
  })
