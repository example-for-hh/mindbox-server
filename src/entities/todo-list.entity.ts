import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TodoEntity } from "./todo.entity";

@Entity('lists')
export class TodoListEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @OneToMany(() => TodoEntity, (todo: TodoEntity) => todo.list)
  todos?: TodoEntity[];
}