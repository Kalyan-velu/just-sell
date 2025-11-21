import {
  Column,
  DataType,
  Default,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Sellers } from './vendor.model';

@Table({ tableName: 'address', timestamps: false })
export class Addresses extends Model<Addresses> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  override id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  addressLine1!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  addressLine2!: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  city!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  state!: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'india' })
  country!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  pinCode!: string;

  @HasMany(() => Sellers)
  sellers?: Sellers[];
}
