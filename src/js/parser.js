const { v4: uuidv4 } = require('uuid');

const parseRss = (xml, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    throw new Error('errors.parse');
  }

  const title = doc.querySelector('channel > title')?.textContent ?? 'No title';
  const description = doc.querySelector('channel > description')?.textContent ?? 'No description';

  const feedId = uuidv4();

  const posts = Array.from(doc.querySelectorAll('item')).map((item) => ({
    id: uuidv4(),
    feedId,
    title: item.querySelector('title')?.textContent ?? 'No title',
    link: item.querySelector('link')?.textContent ?? '#',
  }));

  const feed = {
    id: feedId,
    url,
    title,
    description,
  };

  return { feed, posts };
};

export default parseRss;
