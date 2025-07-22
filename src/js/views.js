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

  const button = document.createElement('button');
  // <button type="button" class="btn btn-outline-primary btn-sm" data-id="13"
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', item.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = i18next.t('show');
  li.append(link, button);
  return li;
});

const renderContent = (feeds, posts, elements) => {
  elements.feeds.innerHTML = '';
  elements.posts.innerHTML = '';

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

const renderModal = (target, posts) => {
  target.previousSibling.classList = 'fw-normal link-secondary';
  const modalTitleEl = document.querySelector('.modal-title');
  const modalBodyEl = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  const modalLink = modalFooter.querySelector('a');

  const postId = target.dataset.id;
  const currentPost = posts.filter((post) => post.id === postId)[0];

  modalTitleEl.textContent = currentPost.title;
  modalBodyEl.textContent = currentPost.description;
  modalLink.href = currentPost.link;
};
const render = (state, elements) => {
  const {
    process, errors, feeds, posts,
  } = state;
  const {
    url, feedback, submitButton, form,
  } = elements;
  console.log(elements.showButtons);
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

export { render, renderNewPosts, renderModal };

{ /* <div class="modal fade show" id="modal" tabindex="-1" aria-labelledby="modal" style="display: block;" aria-modal="true" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Lorem ipsum 2025-07-22T08:05:00Z</h5>
          <button type="button" class="btn-close close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-break">Qui fugiat enim ea occaecat nisi qui.</div>
        <div class="modal-footer">
          <a class="btn btn-primary full-article" href="http://example.com/test/1753171500" role="button" target="_blank" rel="noopener noreferrer">
            Читать полностью
          </a>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-10 col-lg-8 order-1 mx-auto posts"><div class="card border-0">
      <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
    <ul class="list-group border-0 rounded-0">
      <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="http://example.com/test/1753171620" class="fw-bold" data-id="13" target="_blank" rel="noopener noreferrer">Lorem ipsum 2025-07-22T08:07:00Z</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="13" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li>
      <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="http://example.com/test/1753171560" class="fw-normal link-secondary" data-id="12" target="_blank" rel="noopener noreferrer">Lorem ipsum 2025-07-22T08:06:00Z</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="12" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li>
      <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="http://example.com/test/1753171500" class="fw-normal link-secondary" data-id="2" target="_blank" rel="noopener noreferrer">Lorem ipsum 2025-07-22T08:05:00Z</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li> */ }
