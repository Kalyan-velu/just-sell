import {
  Column,
  DataType,
  Default,
  HasOne,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Sellers } from './vendor.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class Users extends Model<Users> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  override id!: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  phone!: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: true })
  email!: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isOnboard!: boolean;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, allowNull: false })
  timestamp!: Date;

  @HasOne(() => Sellers)
  sellers?: Sellers;
}
