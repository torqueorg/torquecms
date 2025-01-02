export default [
  {
    name: 'user',
    fields: [
      {
        name: 'firstName',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'lastName',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'email',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'password',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      },
      {
        name: 'recoveryToken',
        type: 'TEXT',
        params: ['NOT', 'NULL']
      }
    ]
  }
];
