import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocument,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    indexName = process.env.TODOS_INDEX
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getTodosByUserId(userId) {
    console.log('Getting todos by user id')
    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })

    return result.Items
  }

  async createTodo(todo) {
    console.log('Creating todo with id :>> ', todo.id)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })
  }

  async updateTodo(todo, todoId, userId) {
    console.log('Updating todo with id :>> ', todoId)

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
      },
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const response = await this.dynamoDbClient.send(command)
    console.log(response)

    return response
  }

  async deleteTodo(todoId, userId) {
    const command = new DeleteCommand({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    })

    const response = await this.dynamoDbClient.send(command)
    console.log(response)
    return response
  }

  async updateAttachmentUrl(url, todoId, userId) {
    console.log('Updating acttachment url with id :>> ', todoId)

    const command = new UpdateCommand({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': url
      },
      ReturnValues: 'UPDATED_NEW'
    })

    const response = await this.dynamoDbClient.send(command)
    console.log(response)

    return response
  }
}
