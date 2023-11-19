const express = require('express');
const Post = require('../../module/postSchema');
const route = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../module/UserSchema');

const { check, validationResult } = require('express-validator');
const { mongo } = require('mongoose');

route.post(
  '/add',
  auth,
  [check('text', 'text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ errors: errors });

    try {
      const user = await User.findById(req.user.id).select('-password');
      const new_post = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });
      await new_post.save();
      res.status(200).send({ msg: 'Post Created successfully' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'server error' });
    }
  }
);

//get all post
route.get('/', auth, async (req, res) => {
  const allPost = await Post.find().populate('user', ['name', 'email']);
  return res.status(200).send(allPost);
});

//delete from the post
route.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).send({ msg: 'No Post found' });
    } else {
      if (post.user.toString() !== req.user.id) {
        return res.status(404).send({ msg: 'Unable to delete the post' });
      } else {
        await post.remove();
        return res.status(200).send({ msg: 'Post deleted' });
      }
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).send({ msg: 'No Post found' });
    }
    return res.status(500).send({ msg: 'Server error' });
  }
});
//liking the post
route.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).send({ msg: 'already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.send(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'server error' });
  }
});

// dis like the post
route.put('/dislike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.send({ msg: 'Unable to find the post' });
    const removeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(req.user.id);
    console.log(removeIndex);
    if (removeIndex === -1) return res.status(404).send({ msg: 'No Like' });
    post.likes.splice(removeIndex, 1);
    await post.save();

    return res.send(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'server error' });
  }
});

//Comment on the post
route.put(
  '/comment/:id',
  auth,
  [check('text', 'text is required').not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).send({ errors: errors.errors });
      const post = await Post.findById(req.params.id);
      if (!post)
        return res.status(201).send({ msg: 'Unable to find the post' });
      post.comments.unshift({ user: req.user.id, text: req.body.text });
      await post.save();
      return res.send(post);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'server error' });
    }
  }
);
// delete the comment on the post
route.put('/deletecomment/:id', auth, async (req, res) => {
    //check if the post is there
    const post = await Post.findById(req.params.id);
    if(!post) return res.send({msg:'No post found'});
    const deletedComment = post.comments.map((comment)=> comment._id.toString()).indexOf(req.body.commentid);
    if(deletedComment === "-1")
     return res.send({msg:"there is no comment in this post"});
    post.comments.splice(deletedComment,1);

    await post.save();

    return res.send({msg:"Deleted"});

});
module.exports = route;
