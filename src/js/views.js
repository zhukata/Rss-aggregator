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
  list.prepend(...listItems);

  cardBody.append(cardTitle);
  cardEl.append(cardBody, list);

  return cardEl;
};

const renderModal = (post, aEl) => {
  const modalTitleEl = document.querySelector('.modal-title');
  const modalBodyEl = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  const modalLink = modalFooter.querySelector('a');

  aEl.classList.remove('fw-bold');
  aEl.classList.add('fw-normal', 'link-secondary');

  modalTitleEl.textContent = post.title;
  modalBodyEl.textContent = post.description;
  modalLink.href = post.link;
};

const createFeedsEl = (data) => data.map((item) => {
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

const createPostsEl = (data) => data.map((item) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('data-id', item.id);
  link.textContent = item.title;
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  link.addEventListener('click', () => {
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', item.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = i18next.t('show');

  button.addEventListener('click', (e) => {
    e.preventDefault();
    renderModal(item, link);
  });

  li.append(link, button);
  return li;
});

const renderContent = (elements, state) => {
  const { feeds, posts } = state;
  const { feeds: feedsEl, posts: postsEl } = elements;
  feedsEl.innerHTML = '';
  postsEl.innerHTML = '';

  const feedsCard = createCard(i18next.t('feeds'), createFeedsEl(feeds));
  const postsCard = createCard(i18next.t('posts'), createPostsEl(posts));

  elements.feeds.append(feedsCard);
  elements.posts.append(postsCard);
};

const renderNewPosts = (newPosts, posts) => {
  const ulPosts = posts.querySelector('.list-group');
  const newLiEl = createPostsEl(newPosts);
  ulPosts.prepend(...newLiEl);
};

const render = (state, elements) => {
  const {
    process, errors,
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
      renderContent(elements, state);
      break;
    }

    case 'sending':
      submitButton.classList.add('disabled');
      break;

    default:
      throw new Error(`Unknown process state: ${process}`);
  }
};

export { render, renderNewPosts, renderModal };
