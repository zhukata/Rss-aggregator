import { isEmpty } from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';

import validate from './validate.js';
import downloadRss from './downloadRss.js';
import parseRss from './parser.js';
import renderFeedback from './views.js';
import resources from '../locales/index.js';

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
    if (['process', 'errors', 'feeds', 'posts'].includes(path)) {
      renderFeedback(watchedState, elements);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const inputUrl = formData.get('url');

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
      .then(({ feed, posts }) => {
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
        watchedState.process = 'success';
        watchedState.errors = {};
      })
      .catch((err) => {
        if (err.type === 'validation' || err.type === 'duplicate') {
          watchedState.errors = err.payload;
          watchedState.process = 'failed';
        } else {
          watchedState.errors = { url: { message: err.message || 'errors.unknown' } };
          watchedState.process = 'failed';
        }
      });
  });
};
