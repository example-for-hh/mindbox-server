
import { TodoListEntity } from "./entities/todo-list.entity";
import { AppDataSource } from "./db";
import { TodoEntity } from "./entities/todo.entity";

const listRepository = AppDataSource.getRepository(TodoListEntity);
const todoRepository = AppDataSource.getRepository(TodoEntity);

export const resolvers = {
    list: async ({ id }: { id: number }) => {
        try {
            return await listRepository.findOne({ where: { id }, relations: ['todos'] });
        } catch (error) {
            console.error('Ошибка при получении списка:', error);
            throw new Error('Не удалось получить список.');
        }
    },
    lists: async () => {
        try {
            return await listRepository.find({ relations: ['todos'] });
        } catch (error) {
            console.error('Ошибка при получении списков:', error);
            throw new Error('Не удалось получить списки.');
        }
    },
    createList: async ({ input }: { input: Partial<TodoListEntity> }) => {
        try {

            const list = listRepository.create({ title: input.title });

            const savedList = await listRepository.save(list);

            if (Array.isArray(input.todos) && input.todos.length > 0) {

                const savedTodos = await Promise.all(input.todos.map(async todoInput => {
                    const todo = todoRepository.create({
                        ...todoInput,
                        list: savedList
                    });

                    return await todoRepository.save(todo);
                }));

                savedList.todos = savedTodos;
            }

            return savedList;
        } catch (error) {
            console.error('Ошибка при создании списка:', error);
            throw new Error('Не удалось создать список.');
        }
    },
    updateList: async ({ id, input }: { id: number, input: Partial<TodoListEntity> }) => {
        try {
            await listRepository.update(id, input);
            return await listRepository.findOne({ where: { id }, relations: ['todos'] });
        } catch (error) {
            console.error('Ошибка при обновлении списка:', error);
            throw new Error('Не удалось обновить список.');
        }
    },
    deleteList: async ({ id }: { id: number }) => {
        try {
            const list = await listRepository.findOne({ where: { id }, relations: ['todos'] });
            if (!list) {
                throw new Error('Список не найден.');
            }
            if (Array.isArray(list.todos) && list.todos.length > 0) {
                await Promise.all(list.todos.map(async (todo) => await todoRepository.delete(todo.id)));
            }
            await listRepository.delete(id);

            return id;
            
        } catch (error) {
            console.error('Ошибка при удалении списка:', error);
            throw new Error('Не удалось удалить список.');
        }
    },
    todo: async ({ id }: { id: number }) => {
        try {
            return await todoRepository.findOne({ where: { id }, relations: ['list'] });
        } catch (error) {
            console.error('Ошибка при получении задачи:', error);
            throw new Error('Не удалось получить задачу.');
        }
    },
    todos: async () => {
        try {
            return await todoRepository.find();
        } catch (error) {
            console.error('Ошибка при получении задач:', error);
            throw new Error('Не удалось получить задачи.');
        }
    },
    createTodo: async ({ input, listId }: { input: Partial<TodoEntity>, listId: number }) => {
        try {
            const findedList = await listRepository.findOne({ where: { id: listId } });
            if (!findedList) {
                throw new Error(`Список с id ${listId} не найден.`);
            }
            const newTodo = todoRepository.create({
                ...input,
                list: findedList
            });
            await todoRepository.save(newTodo);
            return {
                ...newTodo,
                listId
            };
            
        } catch (error) {
            console.error('Ошибка при создании задачи:', error);
            throw new Error('Не удалось создать задачу.');
        }
    },
    updateTodo: async ({ id, listId }: { id: number, listId: number }) => {
        try {
            const findedList = await listRepository.findOne({ where: { id: listId } });
            if (!findedList) {
                throw new Error(`Список с id ${listId} не найден.`);
            }
            const todo = await todoRepository.findOne({ where: { id } });
            if (!todo) {
                throw new Error(`Задача с id ${id} не найдена.`);
            }
            const newTodo = {
                ...todo,
                checked: !todo.checked
            };
            await todoRepository.update(id, newTodo);
            return {
                id: todo.id,
                listId,
                checked: newTodo.checked
            };
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error);
            throw new Error('Не удалось обновить задачу.');
        }
    },
    deleteTodo: async ({ id, listId }: { id: number, listId: number }) => {
        try {
            const findedList = await listRepository.findOne({ where: { id: listId } });
            if (!findedList) {
                throw new Error(`Список с id ${listId} не найден.`);
            }
            const todo = await todoRepository.findOne({ where: { id, list: { id: listId } }, relations: ['list'] });
            if (!todo) {
                throw new Error('Задача не найдена.');
            }
            await todoRepository.remove(todo);
            return { id, listId };
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
            throw new Error('Не удалось удалить задачу.');
        }
    },
};