const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            validate: {
                validator: function (email) {
                    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return re.test(email)
                },
                message: response => `${response.value} is not a valid email address!`
            },
            required: [true, 'Please enter Email Address'],
            set: email => email.toLowerCase(),
            unique: true,
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true
        },
    }
);

userSchema
    .virtual('friendCount')
    // Getter
    .get(function () {
        return this.friends.length;
    });

const User = model('user', userSchema);

module.exports = User;
