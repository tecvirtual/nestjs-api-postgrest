import { Role } from '../../common/enums/rol.enum';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ default: Role.User, enum: Role, type: 'enum' })
  role: Role;

  @DeleteDateColumn()
  deletedAt: Date;
}
