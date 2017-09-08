import casual from 'casual';

const mocks = {
  String: () => 'It works',
  Query: () => ({
    author: (root, args) => {
      return ({
        firstName: args.firstname,
        lastName: args.lastname,
      });
    },
  }),
  Author: () => ({ firstName: () => casual.first_name, lastName: () => casual.last_name }),
  Post: () => ({ title: casual.title, text: casual.sentences(3) }),

};

export default mocks;
