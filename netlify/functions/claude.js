exports.handler = async function(event, context) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 200, headers: cors, body: '{"status":"ok"}' };

  const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: event.body,
  });

  return {
    statusCode: response.status,
    headers: { 'Content-Type': 'application/json', ...cors },
    body: await response.text()
  };
};
