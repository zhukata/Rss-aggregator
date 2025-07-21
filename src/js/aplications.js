import { isEmpty, update } from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';

import validate from './validate.js';
import downloadRss from './downloadRss.js';
import parseRss from './parser.js';
import { render, renderNewPosts } from './views.js';
import resources from '../locales/index.js';
import { createFeed, createPosts } from './utils.js';

export default async () => {
  await i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  });
  const state = {
    errors: [],
    process: 'filling',
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    url: document.querySelector('input[name="url"]'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = onChange(state, (path) => {
    if (['process', 'errors', 'feeds'].includes(path)) {
      render(watchedState, elements);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const inputUrl = formData.get('url').trim();

    watchedState.process = 'sending';

    const createAppError = (message, type, payload) => {
      const err = new Error(message);
      err.type = type;
      err.payload = payload;
      return err;
    };

    validate({ url: inputUrl })
      .then((errors) => {
        if (!isEmpty(errors)) {
          return Promise.reject(createAppError('error.validation', 'validation', {
            url: { message: 'errors.validate' },
          }));
        }

        const isDuplicate = watchedState.feeds.some((feed) => feed.url === inputUrl);
        if (isDuplicate) {
          return Promise.reject(createAppError('errors.duplicate', 'duplicate', {
            url: { message: 'errors.duplicate' },
          }));
        }

        return downloadRss(inputUrl);
      })
      .then((rssContent) => parseRss(rssContent, inputUrl))
      .then(({ title, description, items }) => {
        const feed = createFeed(title, description, inputUrl);
        const posts = createPosts(items, feed.id);
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
        watchedState.process = 'success';
        watchedState.errors = {};
      })
      .catch((err) => {
        if (err instanceof Error && (err.type === 'validation' || err.type === 'duplicate')) {
          watchedState.errors = err.payload;
          watchedState.process = 'failed';
        } else {
          const key = err.message === 'Network Error' ? 'errors.network' : 'errors.unknown';
          watchedState.errors = {
            url: { message: key },
          };
          watchedState.process = 'failed';
        }
        console.log(err);
      });
  });
  const updateFeeds = () => {
    const promises = watchedState.feeds.map((feed) => (
      downloadRss(feed.url)
        .then((rssContent) => parseRss(rssContent, feed.url))
        .then(({ items }) => {
          const postsInState = watchedState.posts.filter((post) => post.feedId === feed.id);
          const existingLinks = new Set(postsInState.map((p) => p.link));
          const newItems = Array.from(items).filter((item) => {
            const link = item.querySelector('link')?.textContent.trim();
            return link && !existingLinks.has(link);
          });
          // console.log(existingLinks)
          console.log(newItems);

          if (newItems.length > 0) {
            const newPosts = createPosts(newItems, feed.id);
            console.log(newPosts);
            watchedState.posts.push(...newPosts);
            renderNewPosts(newPosts, elements.posts);
          }
        })
        .catch((err) => {
          console.error(`Ошибка обновления фида ${feed.url}:`, err);
        })
    ));

    Promise.all(promises).finally(() => {
      setTimeout(updateFeeds, 5000);
    });
  };

  updateFeeds();
};
