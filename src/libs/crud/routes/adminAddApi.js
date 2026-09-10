import debugSetup from 'debug';
import { v7 as uuid } from 'uuid';
import forms from '../../forms/index.js';

async function adminAddApi(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/addApi`);
    const db = req.app.get('DB');
    const itemFields = {};
    const { fields, files, fieldsSingle } = await forms.parseForm(req);
    const { id } = fieldsSingle;
    const dateNow = new Date().toISOString();

    dbTable.fields.forEach(field => {
      itemFields[field.name] = fieldsSingle[field.name];
    });

    debug('fields', fields);
    debug('files', files);

    if (id) {
      await db.updateOne(dbTable.name, id, {
        ...itemFields,
        modified: dateNow
      });
    } else {
      await db.addOne(dbTable.name, {
        id: uuid(),
        ...itemFields,
        created: dateNow,
        modified: dateNow
      });
    }

    res.redirect(`/admin/${dbTable.name}`);
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminAddApi;
