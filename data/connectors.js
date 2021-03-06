import Sequelize from 'sequelize';
import casual from 'casual';
// import Mongoose from 'mongoose';
import _ from 'lodash';

const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
  views: { type: Sequelize.INTEGER },
});


const PostAuthorAssoc = db.define('assoc_author_post', {
}, {
  freezeTableName: true,
});
AuthorModel.belongsToMany(PostModel, { foreignKey: 'authorId', through: PostAuthorAssoc });
PostModel.belongsToMany(AuthorModel, { foreignKey: 'postId', through: PostAuthorAssoc });

casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      _.times(3, () => {
        PostModel.create({
          title: `A post by ${author.firstName}`,
          text: casual.sentences(3),
          views: casual.integer(0, 100),
        }).then(post => {
          // post.addAuthor(author);
          author.addPost(post);
        });
        // return author.createPost({
        //   title: `A post by ${author.firstName}`,
        //   text: casual.sentences(3),
        //   views: casual.integer(0, 100),
        // });
      });
      return author;
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;
export { Author, Post, PostAuthorAssoc };
