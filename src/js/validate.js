import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';

const schema = yup.object().shape({
  url: yup.string()
    .required('URL обязателен').url('Ссылка должна быть валидным URL'),
});

const validate = (fields) => schema
  .validate(fields, { abortEarly: false })
  .then(() => ({}))
  .catch((e) => keyBy(e.inner, 'path'));

export default validate;
