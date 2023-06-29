import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk-core')
const XAWS = AWSXRay.captureAWS(AWS)


export class TodosAccess {
    constructor(
        private readonly documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) { }

    async createTodoItem(
                todoItem: TodoItem
            ): Promise<TodoItem>
        {
            await this.documentClient.put(
            {
                TableName: this.todosTable,
                Item: todoItem
            }).promise()

            return todoItem;
        }

    async getAllTodos(
                userId: string
            ): Promise<TodoItem[]>
        {
            const res = await this.documentClient.query(
            {
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues:
                {
                    ':userId': userId
                }
            }).promise()
            const todos = res.Items as TodoItem[]
            return todos
        }

    async updateTodoItem(
                todoId: string,
                userId: string,
                todoUpdate: TodoUpdate
            ): Promise<TodoUpdate>
        {
            await this.documentClient.update(
            {
                TableName: this.todosTable,
                Key:
                {
                    todoId,
                    userId
                },
                UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeValues:
                {
                    ':name': todoUpdate.name,
                    ':dueDate': todoUpdate.dueDate,
                    ':done': todoUpdate.done
                },
                ExpressionAttributeNames:
                {
                    '#name': 'name'
                },
                ReturnValues: 'ALL_NEW'
            }).promise()

            return todoUpdate
        }

    async deleteTodoItem(
                todoId: string,
                userId: string
            ): Promise<string>
        {
            await this.documentClient.delete(
            {
                TableName: this.todosTable,
                Key:
                {
                    todoId,
                    userId
                }
            }).promise()

            return todoId
        }

    async updateTodoAttachmentUrl(
                todoId: string,
                userId: string,
                attachmentUrl: string
            ): Promise<void> 
        {
            await this.documentClient.update({
                TableName: this.todosTable,
                Key:
                {
                    todoId,
                    userId
                },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues:
                {
                    ':attachmentUrl': attachmentUrl
                }
            }).promise()
        }

        async getAllTodosForReport(): Promise<TodoItem[]>
        {
            const res = await this.documentClient.scan(
            {
                TableName: this.todosTable
            }).promise()
            const todos = res.Items as TodoItem[]
            return todos
        }
}