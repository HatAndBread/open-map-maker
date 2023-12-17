function requestObject(body: {}) {
  return {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
  }
}

async function post(url: string, object: {[key: string]: string | number | undefined | null | [] | {}}) {
  const result = await window.fetch(url, requestObject(object))
  return await result.json()
}

export {post}
