import { buildSchema } from 'graphql';

const schema = buildSchema(`

    type Todo {
        id: ID!,
        title: String!,
        checked: Boolean!
        listId: ID!
    }

    type List {
        id: ID!,
        title: String!,
        todos: [Todo]!
    }

    type Query {
        list(id: ID!): List!,
        lists: [List]

        todo(id: ID!): Todo!,
        todos: [Todo]
    }

    input TodoInput {
        title: String!,
        checked: Boolean = false
    }

    input ListInput {
        title: String!,
        todos: [TodoInput]!
    }

    type Mutation {
        createList(input: ListInput!): List
        updateList(id: ID!, input: ListInput!): List
        deleteList(id: ID!): ID

        createTodo(input: TodoInput!, listId: ID!): Todo
        updateTodo(id: ID!, listId: ID!): Todo
        deleteTodo(id: ID!, listId: ID!): Todo
    }
`);

export default schema;