const mongoo = require('mongoose');
const PostSchema = new mongoo.Schema({
    user: {
        type: mongoo.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: mongoo.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ]
    , comments: [{

        user: {
            type: mongoo.Schema.Types.ObjectId,
            ref: 'user'
        },
        text: {
            type: String,
            required: true
        }, date: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = Post = mongoo.model('post', PostSchema)