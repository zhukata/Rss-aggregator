import { isEmpty } from 'lodash';
import onChange from 'on-change';

import validate from './validate.js';
import renderFeedback from './views.js';

export default () => {
  const state = {
    errors: [],
    valid: true,
    data: [], // теперь это массив
    process: 'filling',
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    url: document.querySelector('input[name="url"]'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, (path) => {
    if (['process', 'errors'].includes(path)) {
      renderFeedback(watchedState, elements);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(elements.form);
    const inputUrl = formData.get('url').trim();
    watchedState.process = 'sending';

    // Валидируем URL
    validate({ url: inputUrl })
      .then((errors) => {
        const isDuplicate = watchedState.data.some((item) => item.url === inputUrl);
        if (isDuplicate) {
          errors.url = { message: 'RSS уже существует' };
        }

        watchedState.errors = errors;
        watchedState.process = isEmpty(errors) ? 'success' : 'failed';

        if (isEmpty(errors)) {
          watchedState.data.push({ url: inputUrl });
        }
        console.log(state.data);
      });
  });
};
