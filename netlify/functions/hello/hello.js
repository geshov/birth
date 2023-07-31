const handler = async (event) => {
  const subject = event.queryStringParameters.name || 'Voldemar'
  return {
    statusCode: 200,
    body: `Hello ${subject}`,
  }
}

module.exports = { handler }
