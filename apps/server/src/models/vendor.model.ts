import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  PrimaryKey,
  Default,
  IsUUID,
  Unique,
  BelongsTo,
} from 'sequelize-typescript';
import { Addresses } from './address.model';
import { Users } from './user.model';

@Table({ tableName: 'sellers', timestamps: false })
export class Sellers extends Model<Sellers> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  override id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Unique
  @ForeignKey(() => Users)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => Users)
  user?: Users;

  @Unique
  @ForeignKey(() => Addresses)
  @Column({ type: DataType.UUID, allowNull: false })
  address!: string;

  @BelongsTo(() => Addresses)
  addressDetails?: Addresses;
}
