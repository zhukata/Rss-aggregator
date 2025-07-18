import { isEmpty } from 'lodash';
import onChange from 'on-change';

import validate from './validate.js';
import downloadRss from './downloadRss.js';
import parseRss from './parser.js';
import renderFeedback from './views.js';

export default () => {
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
  };

  const watchedState = onChange(state, (path) => {
    if (['process', 'errors', 'feeds', 'posts'].includes(path)) {
      renderFeedback(watchedState, elements);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(elements.form);
    const inputUrl = formData.get('url').trim();
    watchedState.process = 'sending';

    validate({ url: inputUrl })
      .then((errors) => {
        const isDuplicate = watchedState.feeds.some((f) => f.url === inputUrl);
        const newErrors = { ...errors };

        if (isDuplicate) {
          newErrors.url = { message: 'errors.duplicate' };
        }

        const hasErrors = !isEmpty(newErrors);
        watchedState.errors = newErrors;
        watchedState.process = hasErrors ? 'failed' : 'sending';

        if (hasErrors) {
          return Promise.reject(new Error('Validation failed'));
        }

        return downloadRss(inputUrl);
      })
      .then((rssContent) => {
        const { feed, posts } = parseRss(rssContent, inputUrl);
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
        watchedState.process = 'success';
      })
      .catch((err) => {
        if (err.message === 'Validation failed') return;
        watchedState.errors = { url: { message: err.message || 'errors.unknown' } };
        watchedState.process = 'failed';
      });
  });
};
