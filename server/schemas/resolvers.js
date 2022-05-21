const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    user: async () => {
			return User.find({});
		},
    user: async (parent, { args }) => {
			const foundUser = await User.findOne({args})
      .populate('savedBooks');

			return foundUser;
		},
  },

  Muration: {
    addUser: async (parent, {username, email, password}) => {
			const user = await User.create({username, email, password});
			const token = signToken(user);
			return {token, user};
		},
    login: async (parent, {password, email}) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError('Please try again with valid login');
			}
			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Please try again with valid login');
			}

			const token = signToken(user);
			return {token, user};
    },
    saveBook: async (parent, args, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{_id: context.user._id},
					{$addToSet: {savedBooks: args.input}},
					{new: true, runValidators: true}
				);
				return updatedUser;
			}
			throw new AuthenticationError('You need to be logged in!');
		},
		removeBook: async (parent, {bookId}, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{_id: context.user._id},
					{$pull: {savedBooks: {bookId}}},
					{new: true}
				);
				return updatedUser;
			}
			throw new AuthenticationError('You need to be logged in!');
		}
  }
};

module.exports = resolvers;