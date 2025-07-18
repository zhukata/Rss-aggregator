export default (state, elements) => {
  const { process, errors } = state;
  const { url, feedback, submitButton } = elements;

  url.classList.remove('is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');

  switch (process) {
    case 'failed':
      url.classList.add('is-invalid');
      feedback.textContent = errors.url?.message || 'Ошибка валидации';
      feedback.classList.add('text-danger');
      submitButton.classList.remove('disabled');
      break;

    case 'success':
      feedback.textContent = 'RSS успешно загружен';
      feedback.classList.add('text-success');
      submitButton.classList.remove('disabled');
      elements.form.reset(); // опционально
      break;

    case 'sending':
      submitButton.classList.add('disabled');
      break;

    default:
      throw new Error(`Unknown process state: ${process}`);
  }
};
