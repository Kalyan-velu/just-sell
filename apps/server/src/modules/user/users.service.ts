import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../../models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    return this.userModel.create({ ...createUserDto, password: hash });
  }

  findAll() {
    return `This action returns all users`;
  }

  findById(id: string) {
    return this.userModel.findByPk(id);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ where: { email: email } });
  }
  findOneByPhone(phone: string) {
    return this.userModel.findOne({ where: { phone: phone } });
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.update(
      { refreshToken },
      { where: { id: userId } }
    );
  }

  async clearRefreshToken(userId: string) {
    await this.userModel.update(
      { refreshToken: null },
      { where: { id: userId } }
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
