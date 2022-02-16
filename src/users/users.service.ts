import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { to } from 'src/utils/utils';
import { LessThanOrEqual } from 'typeorm';
import { AccessRightRepository } from './accessRight.repository';
import { createUserDto } from './dto/create-user.dto';
import { RolePermitted, User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AccessRightRepository)
    private accessRightRepository: AccessRightRepository
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
    user.avatar = 'boy';
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

  async createUsersByUpload(res, file) {
    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.log(err);
          }
        });
        Promise.all(
          results.map(async (user) => {
            await this.createUser(user);
          })
        )
          .then((response) => {
            res.json({ message: 'Successfully Uploaded Users' });
          })
          .catch((error) => {
            //console.log(error);
            res.status(HttpStatus.CONFLICT).json({ message: error.message });
          });
      });
  }

  async editUser(editUser, userStat) {
    let {
      id,
      firstName,
      lastName,
      userName,
      password,
      email,
      gender,
      role,
      identityStatus,
      mobile,
      institution,
      faculty,
      address,
      accessableCourseIds,
      canCreateExam,
    } = editUser;

    const [err, user] = await to(
      this.userRepository.findOne({
        where: { id: +id },
        relations: ['accessRight'],
      })
    );

    if (err) throw new InternalServerErrorException(err.message);

    if (+id === userStat || userStat.role >= RolePermitted.mentor) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.userName = userName;
      user.gender = gender;
    }

    if (+id === userStat || userStat.role >= RolePermitted.moderator) {
      user.email = email;
      user.mobile = mobile;
      user.institution = institution;
      user.faculty = faculty;
      user.address = address;
      //hashing password
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    }

    if (userStat.role >= RolePermitted.coordinator) {
      user.role =
        +role > RolePermitted.coordinator ? RolePermitted.moderator : +role;
      user.identityStatus = +identityStatus;

      if (accessableCourseIds && accessableCourseIds.length > 0) {
        if (
          +role > RolePermitted.student &&
          +role < RolePermitted.coordinator
        ) {
          if (user.accessRight) {
            //console.log(user.accessRight, canCreateExam);
            user.accessRight.accessableCourseIds = accessableCourseIds;
            user.accessRight.canCreateExam =
              canCreateExam === '1' ? true : false;
            const [error, accessRightResponse] = await to(
              user.accessRight.save()
            );
            if (error) throw new InternalServerErrorException(error.message);
          } else {
            const accessRight = this.accessRightRepository.create({
              accessableCourseIds: accessableCourseIds,
              canCreateExam: canCreateExam === '1' ? true : false,
            });

            const [error, accessRightResponse] = await to(accessRight.save());
            if (error) throw new InternalServerErrorException(error.message);
            user.accessRight = accessRight;
          }
        }
      }
    }

    try {
      await user.save();
      return { message: 'User edited successfully' };
    } catch (error) {
      console.log(error);
      if (error.code == 11000) {
        throw new ConflictException(`Email: ['${email}'] is already exist.`);
      } else throw new InternalServerErrorException();
    }
  }

  async deleteUser(id) {
    const [err, result] = await to(this.userRepository.delete(+id));
    if (err) {
      throw new InternalServerErrorException();
    }
    return { message: `User deleted successfully` };
  }

  async findAllUsers(user: User) {
    return await this.userRepository.find({
      // select: [
      //   'id',
      //   'firstName',
      //   'userName',
      //   'lastName',
      //   'role',
      //   'email',
      //   'avatar',
      //   'createdAt',
      //   'gender',
      //   'loginProvider',
      //   'identityStatus',
      //   'mobile',
      //   'faculty',
      //   'institution',
      // ],
      where: {
        role: LessThanOrEqual(user.role),
      },
      relations: ['accessRight'],
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
          { select: ['id', 'firstName', 'lastName'] }
        )
      );
      if (err) throw new InternalServerErrorException();
      if (user == null) return;
      return { name: user.firstName + ' ' + user.lastName, id: user.id };
    }
    if (isForAuth) {
      const [err, user] = await to(
        this.userRepository.findOne(
          { email: email },
          { select: ['id', 'email', 'password', 'role'] }
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
            'id',
            'firstName',
            'userName',
            'lastName',
            'role',
            'email',
            'avatar',
            'createdAt',
            'mobile',
            'faculty',
            'institution',
            'address',
            'gender',
          ],
        }
      )
    );
    if (err) throw new InternalServerErrorException();

    return user;
  }

  async findOneUserById(
    id: string,
    nameOnly: boolean = false,
    isForAuth: boolean = false
  ): Promise<User | any> {
    if (nameOnly) {
      const [err, user] = await to(
        this.userRepository.findOne(
          { id: +id },
          { select: ['id', 'firstName', 'lastName'] }
        )
      );
      if (err) throw new InternalServerErrorException();
      if (user == null) return;
      return { name: user.firstName + ' ' + user.lastName, id: user.id };
    }
    if (isForAuth) {
      const [err, user] = await to(
        this.userRepository.findOne(
          { id: +id },
          { select: ['id', 'email', 'password', 'role'] }
        )
      );
      if (err) throw new InternalServerErrorException();
      return user;
    }
    const [err, user] = await to(
      this.userRepository.findOne(
        { id: +id },
        {
          select: [
            'id',
            'firstName',
            'userName',
            'lastName',
            'role',
            'email',
            'avatar',
            'createdAt',
            'mobile',
            'faculty',
            'institution',
            'address',
            'gender',
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
        .createQueryBuilder('user')
        .where('user.role = :role', { role: RolePermitted.student.toString() })
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
        'Avatart can not be updated',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }

  async getAccessRight(id) {
    const [err, user] = await to(
      this.userRepository.findOne({
        where: { id: +id },
        relations: ['accessRight'],
      })
    );
    if (err) throw new InternalServerErrorException(err.message);
    return user.accessRight;
  }
}
