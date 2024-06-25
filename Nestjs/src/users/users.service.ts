import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { address, age, email, gender, name, password, role, company } =
      createUserDto;
    // add logic check email
    const isExistEmail = await this.userModel.findOne({ email });
    if (isExistEmail) {
      throw new BadRequestException(
        `Email: ${email} had existed on the system . Pls , use email diff`,
      );
    }
    const hashPassword = this.getHashPassword(password);
    let newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      address,
      age,
      gender,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, population, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return 'not found user';
    return await this.userModel.findOne({ _id: id }).select("-password"); // không bao gồm pw trả về
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ email: username });
  }

  isValidCheckUserPassword(pw: string, hash: string) {
    return compareSync(pw, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const foundUser = await this.userModel.findOne({ _id: updateUserDto._id }).exec();
  
    if (!foundUser) {
      throw new NotFoundException(`User with ID ${updateUserDto._id} not found`);
    }
  
    Object.assign(foundUser, updateUserDto, {
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    });
  
    return await foundUser.save();
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';

    await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    let deleteUser =  this.userModel.softDelete({
      _id: id,
    });
    return deleteUser
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  checkPassword(hash: string, plain: string) {
    return compareSync(hash, plain);
  }

  async register(user: RegisterUserDto) {
    const { address, age, email, gender, name, password } = user;
    // add logic check email
    const isExistEmail = await this.userModel.findOne({ email });
    if (isExistEmail) {
      throw new BadRequestException(
        `Email: ${email} had existed on the system . Pls , use email diff`,
      );
    }

    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      address,
      age,
      gender,
      role: 'USER',
    });
    return newRegister;
  }

  updateUserToken = async(refreshToken: string, _id:string) => {
    return await this.userModel.updateOne(
      {_id},
      {refreshToken}
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken})
  }
}
