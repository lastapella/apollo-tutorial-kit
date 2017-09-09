import { Author, Post, PostAuthorAssoc } from './connectors';
import casual from 'casual';

const resolvers = {
  Query: {
    author(root, args) {
      return (Author.find({ where: args }));
    },
    allAuthor() {
      return Author.findAll();
    },
    allPost() {
      return Post.findAll();
    },
  },
  Mutation: {
    addAuthor(root, args) {
      return Author.create({
        firstName: args.firstName,
        lastName: args.lastName,
      })
        .then(author => {
          let workers = [];
          if (args.posts) {
            workers = args.posts.map(postId => {
              return Post.findOrCreate({
                where: { id: postId }, defaults: {
                  title: `A post by ${author.firstName}`,
                  text: casual.sentences(3),
                  views: casual.integer(0, 100),
                },
              })
                .then(post => {
                  author.addPost(post[0]);
                  // post[0].addAuthor(author);
                });
            });
          }
          return Promise.all(workers)
            .then(() => {
              return Author.find({ where: { id: author.id } });
            });
        });
    },
    updateAuthor(root, args) {
      return Author.find({ where: { id: args.id } })
        .then(author => {
          /* Modification et ajout des post */
          let workers = [];
          if (args.firstName) workers.push(author.update({ firstName: args.firstName }));
          if (args.lastName) workers.push(author.update({ lastName: args.lastName }));
          if (args.addedPosts) {
            workers = workers.concat(args.addedPosts.map(postId => {
              return Post.findOrCreate({
                where: { id: postId }, defaults: {
                  title: `A post by ${author.firstName}`,
                  text: casual.sentences(3),
                  views: casual.integer(0, 100),
                },
              })
                .then(post => {
                  console.log('INSERT');
                  author.addPost(post[0]);
                  // post[0].addAuthor(author);
                });
            }));
          }
          return Promise.all(workers)
            .then(() => {
              /* Suppression des relation post/author */
              let workers2 = [];
              if (args.deletePosts) {
                workers2 = args.deletePosts.map(postID => {
                  console.log('DELETE');
                  return PostAuthorAssoc.destroy({ where: { postId: postID, authorId: author.id } });
                });
              }
              return Promise.all(workers2);
            })
            .then(() => {
              return Author.find({ where: { id: author.id } });
            });
        });
    },
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
  Post: {
    author(post) {
      return post.getAuthors();
    },
  },
};
export default resolvers;
