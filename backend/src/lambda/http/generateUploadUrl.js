import middy from '@middy/core'
import cors from '@middy/http-cors'
import {
  getUploadUrls,
  updateAttachmentUrl
} from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import httpErrorHandler from '@middy/http-error-handler'

const bucketName = process.env.TODOS_S3_BUCKET
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

    const uploadUrl = await getUploadUrls(todoId, userId)
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const updatedItem = await updateAttachmentUrl(imageUrl, todoId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl })
    }
  })
