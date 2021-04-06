import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { to } from "src/utils/utils";
import { LessThan } from "typeorm";
import { createUserDto } from "./dto/create-user.dto";
import { RolePermitted, User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async createUser(createUserDto: createUserDto) {
    let {
      firstName,
      lastName,
      userName,
      password,
      email,
      gender,
    } = createUserDto;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.userName = userName;
    user.email = email;
    user.avatar = "boy";
    user.gender = gender;

    //hashing password
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      return user;
    } catch (error) {
      console.log(error);
      if (error.code == 11000) {
        throw new ConflictException(`Email: ['${email}'] is already exist.`);
      } else throw new InternalServerErrorException();
    }
  }

  async findAllUsers(userRole) {
    return await this.userRepository.find({
      select: [
        "id",
        "firstName",
        "userName",
        "lastName",
        "role",
        "email",
        "avatar",
        "createdAt",
      ],
      where: {
        role: LessThan(userRole),
      },
    });
  }

  async findOneUser(
    email: string,
    nameOnly: boolean = false,
    isForAuth: boolean = false
  ): Promise<User | any> {
    if (nameOnly) {
      const [err, user] = await to(
        this.userRepository.findOne(
          { email },
          { select: ["id", "firstName", "lastName"] }
        )
      );
      if (err) throw new InternalServerErrorException();
      if (user == null) return;
      return { name: user.firstName + " " + user.lastName, id: user.id };
    }
    if (isForAuth) {
      const [err, user] = await to(
        this.userRepository.findOne(
          { email: email },
          { select: ["id", "email", "password", "role"] }
        )
      );
      if (err) throw new InternalServerErrorException();
      return user;
    }
    const [err, user] = await to(
      this.userRepository.findOne(
        { email: email },
        {
          select: [
            "id",
            "firstName",
            "userName",
            "lastName",
            "role",
            "email",
            "avatar",
            "createdAt",
          ],
        }
      )
    );
    if (err) throw new InternalServerErrorException();

    return user;
  }

  async findAllStudentNumber(): Promise<number | InternalServerErrorException> {
    //const [err, result] = await to(this.userRepository.count());
    const [err, result] = await to(
      this.userRepository
        .createQueryBuilder("user")
        .where("user.role = :role", { role: RolePermitted.student.toString() })
        .getCount()
    );
    if (err) return 100;
    return result;
  }

  async changeAvatar(id, name) {
    const [err, result] = await to(
      this.userRepository.update(id, { avatar: name })
    );

    if (err) {
      console.log(err);
      throw new HttpException(
        "Avatart can not be updated",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }
}
