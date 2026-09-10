import moduleConfig from './moduleConfig.js';

export default [
  {
    name: moduleConfig.code,
    fields: [
      {
        name: '_id',
        type: 'INTEGER',
        params: ['PRIMARY', 'KEY', 'AUTOINCREMENT']
      },
      {
        name: 'id',
        type: 'TEXT',
        params: ['UNIQUE', 'NOT', 'NULL']
      },
      {
        name: 'created',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'modified',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      ...moduleConfig.fields.map(function (field) {
        return {
          name: field.name,
          type: field.type,
          params: ['NOT', 'NULL']
        };
      })
    ]
  }
];
