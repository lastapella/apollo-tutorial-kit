import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
} from 'graphql-tools';
import Resolvers from './resolvers';

const typeDefs = `

type Author {
  id: Int
  firstName: String
  lastName: String
  posts: [Post]
}

type Post {
  id: Int
  title: String
  text: String
  author: Author
  views: Int
}

type Query {
  author(firstName: String, lastName: String): Author
  allAuthor: [Author]
  allPost: [Post]
}
`;

const schema = makeExecutableSchema({ typeDefs });

addResolveFunctionsToSchema(schema, Resolvers);


export default schema;
