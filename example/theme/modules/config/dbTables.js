export default [
  {
    name: 'config',
    fields: [
      {
        name: 'title',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'name',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'type',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'value',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      }
    ]
  }
];
