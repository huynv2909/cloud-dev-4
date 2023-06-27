// ApiGateway ID
const apiId = 'pef59pmjuf'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // auth0 service
  domain: 'dev-2ocseytrpdia4l6y.us.auth0.com',           // Auth0 domain
  clientId: 'c91MTiNAVkoyxpD7eveD5oVDHpFqIuMp',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
