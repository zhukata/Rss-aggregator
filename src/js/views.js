import i18next from 'i18next';

const createCard = (titleText, listItems) => {
  const cardEl = document.createElement('div');
  cardEl.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = titleText;

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  list.append(...listItems);

  cardBody.append(cardTitle);
  cardEl.append(cardBody, list);

  return cardEl;
};

const renderFeeds = (data) => data.map((item) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = item.title;

  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = item.description;

  li.append(title, description);
  return li;
});

const renderPosts = (data) => data.map((item) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.textContent = item.title;
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  li.append(link);
  return li;
});

const renderContent = (feeds, posts, elements) => {
  elements.feeds.innerHTML = '';
  elements.posts.innerHTML = '';

  const feedsCard = createCard(i18next.t('feeds'), renderFeeds(feeds));
  const postsCard = createCard(i18next.t('posts'), renderPosts(posts));

  elements.feeds.append(feedsCard);
  elements.posts.append(postsCard);
};

export default (state, elements) => {
  const {
    process, errors, feeds, posts,
  } = state;
  const {
    url, feedback, submitButton, form,
  } = elements;

  url.classList.remove('is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');

  switch (process) {
    case 'failed': {
      const key = errors.url?.message || 'errors.unknown';
      feedback.textContent = i18next.t(key);
      feedback.classList.add('text-danger');
      url.classList.add('is-invalid');
      submitButton.classList.remove('disabled');
      break;
    }

    case 'success': {
      feedback.textContent = i18next.t('success');
      feedback.classList.add('text-success');
      submitButton.classList.remove('disabled');
      form.reset();
      renderContent(feeds, posts, elements);
      break;
    }

    case 'sending':
      submitButton.classList.add('disabled');
      break;

    default:
      throw new Error(`Unknown process state: ${process}`);
  }
};
