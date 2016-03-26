import faker from 'faker';
import _ from 'lodash';

const generate = () => ({
  users: _.times(5, index => ({
    id: index,
    last_name: faker.name.firstName(),
    first_name: faker.name.lastName(),
    avatar: faker.internet.avatar(),
    email: faker.internet.email()
  })),
  posts: _.times(15, index => ({
    id: index,
    body: faker.lorem.words()
  }))
});

export default generate;
