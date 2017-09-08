import { Author, Post } from './connectors';

const resolvers = {
  Query: {
    author(_, args) {
      console.log(args.firstName);
      return (Author.find({ where: args }));
    },
    allAuthor() {
      return Author.findAll();
    },
    allPost() {
      return Post.findAll();
    }
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
  },
};
export default resolvers;
