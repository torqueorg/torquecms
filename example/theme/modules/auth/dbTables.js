export default [
  {
    name: 'auth',
    fields: [
      {
        name: 'userId',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'expire',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      }
    ]
  }
];
