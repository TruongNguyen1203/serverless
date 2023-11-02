import middy from "@middy/core";
import cors from "@middy/http-cors";
import { getUserId } from "../utils.mjs";
import { getTodosByUserId } from "../../businessLogic/todos.mjs";

export const handler = middy()
  .use(
    cors({
      credential: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const userId = getUserId(event)
    const todosByUserId = await getTodosByUserId(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todosByUserId
      })
    }
  })
