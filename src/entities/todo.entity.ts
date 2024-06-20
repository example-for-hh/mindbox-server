import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TodoListEntity } from './todo-list.entity';

@Entity('todos')
export class TodoEntity {

  @PrimaryGeneratedColumn()
  id!: number;


  @Column()
  title!: string;

  @Column()
  checked!: boolean;

  @ManyToOne(() => TodoListEntity, (list) => list.todos)
  list!: TodoListEntity;
}
