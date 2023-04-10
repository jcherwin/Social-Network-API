const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with that ID' })
                } else {
                    res.json({
                        user,
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // Update a user
    updateUser(req, res) {
        const filter = { _id: req.params.userId };
        const update = {
            username: req.body.username,
            email: req.body.email
        };

        User.findOneAndUpdate(filter, update)
            .select('-__v')
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with that ID' })
                } else {
                    res.json({
                        user,
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a user and remove associated thoughts
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ message: 'No such user exists' })
                } else {
                    //console.log(user.username);
                    await Thought.deleteMany(
                        { username: user.username },
                    )
                }
            })
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({
                        message: 'User deleted, along with thoughts',
                    })
                } else {
                    res.json({ message: 'User successfully deleted' })
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //Matches user and then adds unique friend id to array
    addFriend(req, res) {
        const filter = { _id: req.params.userId };
        const update = {
            $addToSet: { friends: req.params.friendId }
        };

        User.findOneAndUpdate(filter, update, { new: true })
            .select('-__v')
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with that ID' })
                } else {
                    res.json({
                        user
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //Matches user and then removes provided friend id from array
    removeFriend(req, res) {
        const filter = { _id: req.params.userId };
        const update = {
            $pull: { friends: req.params.friendId }
        };

        User.findOneAndUpdate(filter, update, { new: true })
            .select('-__v')
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with that ID' })
                } else {
                    res.json({
                        user
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
};
