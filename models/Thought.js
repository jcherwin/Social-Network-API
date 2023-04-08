const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Schema to create a course model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        username: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    // Getter
    .get(function () {
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
