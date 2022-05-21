const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type Book {
		_id: ID!
		authors: [String]
		description: String!
		bookId: ID!
		image: String
		link: String
		title: String
	}
	type User {
		_id: ID
		username: String!
		email: String!
		bookCount: Int
		password: String!
		savedBooks: [Book]
	}
	type Query {
		user(_id: String, username: String): User
		users: [User]
		me: User
	}
	type Auth {
		token: ID!
		user: User
	}
	input BookInput {
		authors: [String]
		description: String!
		bookId: String!
		image: String
		link: String
		title: String!
	}
	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		saveBook(input: BookInput!): User
		removeBook(bookId: String!): User
	}
`;

module.exports = typeDefs;