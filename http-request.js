export async function sendRequest({
  url,
  method,
  useCredentials = false,
  body,
  headers = {},
  queryParams = {},
  expectMessage = ''
}) {
  const options = {
    method: method,
    headers: new Headers({ 'content-type': 'application/json', ...headers }),
    body: body ? JSON.stringify(body) : null
  }

  if (useCredentials) options.credentials = 'include'

  if (queryParams) {
    url = `${url}?${new URLSearchParams(queryParams).toString()}`
  }

  const response = await fetch(url, options)
  const text = await response.text()
  let json
  try {
    json = text && JSON.parse(text)
  } catch (error) { }

  if (response.ok) return json

  // error
  return Promise.reject({
    ok: false,
    status: response.status,
    message: expectMessage || (json && json.message) || response.statusText,
  })
}
