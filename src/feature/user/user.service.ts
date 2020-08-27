import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserSession } from 'src/share/interface/session.interface';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from '../auth/constansts/jwt.constanst';
import { genSalt, hash } from 'bcrypt';
import { RegisterInput } from '../auth/inputs/register.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getUserByIdOrFail(id: string) {
    try {
      return await this.userRepo.findOneOrFail(id);
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async findOne(id: string) {
    return this.userRepo.findOne(id);
  }

  async findOneByName(username: string) {
    return this.userRepo.findOne({username});
  }

  async decodeToken(token: string): Promise<any> {
    const decoded = verify(token, jwtConstants.secret);
    const { userId } = decoded as UserSession;
    return { userId };
  }

  async createUser(userData: RegisterInput) {
    const existedUser = await this.userRepo.findOne({ username: userData.username });
    if (existedUser) {
      throw new BadRequestException('username already existed');
    }
    if (userData.password !== userData.passwordCheck) {
      throw new BadRequestException(
        'Password and password check must be identical',
      );
    }
    const salt = await genSalt(10);
    const hashedPassword = await hash(userData.password, salt);
    const user = new UserEntity({
      username: userData.username,
      password: hashedPassword,
      fullname: userData.fullname,
      email: userData.email,
    });

    return this.userRepo.save(user);
  }
}
