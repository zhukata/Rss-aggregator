import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

yup.setLocale({
  string: {
    url: 'errors.url',
  },
  mixed: {
    required: 'errors.required',
  },
});

const schema = yup.object().shape({
  url: yup.string()
    .required().url(),
});

const validate = (fields) => schema
  .validate(fields, { abortEarly: false })
  .then(() => ({}))
  .catch((e) => keyBy(e.inner, 'path'));

export default validate;
