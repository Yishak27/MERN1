const express = require('express')
const Post = require('../../module/postSchema');
const route = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../module/UserSchema');

const { check, validationResult } = require('express-validator');

route.post('/add', auth,
    [check('text', 'text is required').not().isEmpty()]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({ errors: errors })

        try {
            const user = await User.findById(req.user.id).select("-password");
            const new_post = new Post({
                user: req.user.id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar
            });
            await new_post.save();
            res.status(200).send({ msg: 'Post Created successfully' });
        }
        catch (err) {
            console.log(err);
            return res.status(500).send({ msg: 'server error' })
        }
    })


//get all post
route.get('/', auth, async (req, res) => {
    const allPost = await Post.find().populate('user', ['name', 'email']);
    return res.status(200).send(allPost);
})

//delete from the post
route.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({ _id: req.params.id })
        console.log(post);
        if (post) {
            return res.status(200).send({ msg: 'Post deleted' });
        } else {
            return res.status(400).send({ msg: 'No Post found' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: 'Server error' })
    }
})
module.exports = route;