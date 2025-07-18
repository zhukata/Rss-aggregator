export default (state, elements, newIstance) => {
  const { process, errors } = state;
  const {
    url, feedback, submitButton, form,
  } = elements;

  url.classList.remove('is-invalid');
  feedback.textContent = '';
  feedback.classList.remove('text-danger', 'text-success');

  switch (process) {
    case 'failed': {
      const key = errors.url?.message || 'errors.unknown';
      feedback.textContent = newIstance.t(key);
      feedback.classList.add('text-danger');
      url.classList.add('is-invalid');
      submitButton.classList.remove('disabled');
      break;
    }

    case 'success': {
      feedback.textContent = newIstance.t('success');
      feedback.classList.add('text-success');
      submitButton.classList.remove('disabled');
      form.reset();
      break;
    }

    case 'sending':
      submitButton.classList.add('disabled');
      break;

    default:
      throw new Error(`Unknown process state: ${process}`);
  }
};
