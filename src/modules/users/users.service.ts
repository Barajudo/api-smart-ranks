import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const createdUser = await this.userModel.create(createUserDto);
    return new UserResponseDto(createdUser.toJSON());
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find({ isActive: true });
    return users.map((user: User) => new UserResponseDto(user.toJSON()));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ _id: id, isActive: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponseDto(user.toJSON());
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: updateUserDto },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto(user.toJSON());
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { isActive: false } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
