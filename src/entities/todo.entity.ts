import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { TodoListEntity } from './todo-list.entity';

@Entity('todos')
export class TodoEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  checked!: boolean;

  @ManyToOne(() => TodoListEntity, (list) => list.todos, { cascade: true })
  @JoinColumn({ name: 'listId' })
  list!: TodoListEntity;
}
