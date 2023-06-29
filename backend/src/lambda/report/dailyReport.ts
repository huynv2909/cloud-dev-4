import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { publishMessageToSNSTopic } from '../utils'
import { getTodosForReport } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('dailyReport')
const topicArn = process.env.topicARN;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('dailyReport ' + event)
    const todos = await getTodosForReport()

    const today = new Date()
    // get total user
    var userIdList = []
    todos.forEach(function(todo) {
      if (!userIdList.includes(todo['userId'])) {
        userIdList.push(todo['userId'])
      }
    });
    // get new todos
    const newTodos = todos.filter(todos =>
      (todos.createdAt.substring(0, 10) == new Date().toISOString().slice(0, 10)))
    // get overdue todos
    const overdueTodos = todos.filter(todos =>
      ((new Date(todos.dueDate)) < today) && (!todos.done))
    const message = `Report of ${today}:
                    - There are total ${userIdList.length} users
                    - ${newTodos.length} new todos was made
                    - ${overdueTodos.length} todos are overdue`

    await publishMessageToSNSTopic(topicArn, message)
    logger.info('message ' + message)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
