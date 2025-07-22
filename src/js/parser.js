const parseRss = (xml) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const parseError = doc.querySelector('parsererror')

  if (parseError) {
    throw new Error('errors.parse')
  }

  const title = doc.querySelector('channel > title')?.textContent ?? 'No title'
  const description = doc.querySelector('channel > description')?.textContent ?? 'No description'
  const items = doc.querySelectorAll('item')

  return { title, description, items }
}

export default parseRss
