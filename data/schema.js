import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
} from 'graphql-tools';
import Resolvers from './resolvers';

const typeDefs = `

# A post blog author
type Author {
  id: Int
  firstName: String
  lastName: String
  # Posts of the Author
  posts: [Post]
}

type Post {
  id: Int
  title: String
  text: String
  author: [Author]
  views: Int
}

type Query {
  author(firstName: String, lastName: String): Author
  allAuthor: [Author]
  allPost: [Post]
}

type Mutation {
  addAuthor(firstName: String!, lastName: String!, posts: [Int]): Author
  updateAuthor(id: Int!, firstName: String, lastName: String, addedPosts: [Int], deletePosts: [Int]) : Author
}
`;

const schema = makeExecutableSchema({ typeDefs });

addResolveFunctionsToSchema(schema, Resolvers);


export default schema;
