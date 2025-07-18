import { isEmpty } from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';

import validate from './validate.js';
import renderFeedback from './views.js';
import resources from '../locales/index.js';

export default async () => {
  const newIstance = i18next.createInstance();
  await newIstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

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
      renderFeedback(watchedState, elements, newIstance);
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
        const newErrors = { ...errors };

        if (isDuplicate) {
          newErrors.url = { message: 'errors.duplicate' };
        }

        watchedState.errors = newErrors;
        watchedState.process = isEmpty(newErrors) ? 'success' : 'failed';

        if (isEmpty(newErrors)) {
          watchedState.data.push({ url: inputUrl });
        }
      });
  });
};
