import debugSetup from 'debug';
import formidable from 'formidable';
import { firstValues } from 'formidable/src/helpers/firstValues.js';

const debug = debugSetup('app/src/libs/forms/parse');

async function parseForm(req) {
  const form = formidable({ allowEmptyFiles: true, minFileSize: 0 });

  debug('form', !!form, form.parse);

  const [fields, files] = await form.parse(req);

  debug('fields', fields);
  debug('files', files);

  const exceptions = [];
  const fieldsSingle = firstValues(form, fields, exceptions);

  debug('fieldsSingle', fieldsSingle);

  const dateNow = new Date().toISOString();

  return { fields, fieldsSingle, files };
}

export default parseForm;
