import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId, publishMessageToSNSTopic } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')
const topicArn = process.env.topicARN;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('deleteTodo ' + event)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    await deleteTodo(
      todoId,
      userId
    )
    await publishMessageToSNSTopic(topicArn,  `${userId} deleted a todo`)
    return {
      statusCode: 204,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
