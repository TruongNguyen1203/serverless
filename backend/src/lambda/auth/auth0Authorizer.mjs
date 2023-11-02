import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJbilmnZyccbQfMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1mc3cxaW04NTc0bDFxZWd2LnVzLmF1dGgwLmNvbTAeFw0yMzEwMzAx
NjAwMDBaFw0zNzA3MDgxNjAwMDBaMCwxKjAoBgNVBAMTIWRldi1mc3cxaW04NTc0
bDFxZWd2LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALmkQzygv6kQS/b9Pee6Jn8Q4yt5062q9chYPzTqy15sEtzm1vYn/7Laje4i
UE0eQnwln2UjhGblittqqC9prU/C+TXnn6kkFn8WEAs8sLucS9gSAJ7YTAhfj54X
qAceqKrSJhOBn1XjeJ2h1PtCKloIV0zMByChVWFTVJDpllU6RUJf1FnMjyZfeTaV
pATbDP+M5dWaIT5nBNob61IzBFVUlRyODGPkRixj48wIbKVtIEgziYkK60HTyOLj
1hrmniNmbSBq0RF7gCL9ol7YpXBW3FDuNw/eGML/RSmWxcebD0NyfYV+5b7gXfcW
GupVTrbMKqtQCEM/4Y3a2qWLfI0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUBv3OiUrOK/YzOg98sm7W90KRDkYwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBu2IiMEXUdTIr6kDxGrEY0wsF2u1TjfaigIxjOikPP
kRgdWSXsRdomZOVdpXd8kDXMx++/SH51FwQPYA11lUUSLhFwzFOFVFsDP946xEL7
J3+VChY1lD7odXPE6fnRq8CJrS4I745CK49sYmaftFG89E21883a844SYY7vQe2s
F03OESy5owRMcmF3XjpIuLYAk8SRdXHErNG4SogmlTGOxoqfaYcQK/LNjSszEHkd
xOd+pAhWey2QICAn9MPI3W79mDbKde5J/UJv9nneXAIPtHtix/uGxsrP5OqNY8cS
ET+YLRlB6J3hLyJomsWOzV9FUHqj8qtOcQvb40YzT6Ev
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  //const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, certificate, {algorithms: ['RS256']});
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
