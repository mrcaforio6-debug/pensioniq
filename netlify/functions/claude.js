exports.handler = async function(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ status: 'PensionIQ Function aktiv' }) };
  }

  const apiKey = event.headers['x-api-key'] || event.headers['X-Api-Key'];

  if (!apiKey) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: { message: 'API Key fehlt' } }) };
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: event.body,
  });

  const text = await response.text();

  return {
    statusCode: response.status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: text
  };
};
