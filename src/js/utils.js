import { v4 as uuidv4 } from 'uuid';

const createFeed = (title, description, url) => {
  const feedId = uuidv4();
  const feed = {
    id: feedId,
    url,
    title,
    description,
  };
  return feed;
};

const createPosts = (items, feedId) => {
  const posts = Array.from(items).map((item) => ({
    id: uuidv4(),
    feedId,
    title: item.querySelector('title')?.textContent ?? 'No title',
    link: item.querySelector('link')?.textContent ?? '#',
  }));
  return posts;
};

export { createFeed, createPosts };
