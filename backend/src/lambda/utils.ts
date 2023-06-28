import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

const AWS = require('aws-sdk');

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export async function publishMessageToSNSTopic(topicArn, message) {
  // Create an SNS client
  const sns = new AWS.SNS();

  // Publish the message to the specified topic
  const params = {
    TopicArn: topicArn,
    Message: message
  };

  try {
    const response = await sns.publish(params).promise();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}