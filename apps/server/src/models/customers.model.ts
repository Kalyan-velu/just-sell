import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript';
import { Users } from './user.model';

export class Customers extends Model<Customers> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  override id!: string;

  @Unique
  @ForeignKey(() => Users)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => Users)
  user?: Users;
}
