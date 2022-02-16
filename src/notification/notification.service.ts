import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { to } from 'src/utils/utils';
import { IsNull, LessThanOrEqual } from 'typeorm';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationType } from './notification.entity';
import { NotificationRepository } from './notification.repository';
import moment = require('moment');

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository
  ) {}

  async findAllGeneralNotification(options = null) {
    if (options) {
      const { courseId, dayLimit } = options;

      const [err, gns] = await to(
        this.notificationRepository.find({
          select: [
            'id',
            'title',
            'description',
            'priority',
            'startDate',
            'endDate',
          ],
          where: {
            type: NotificationType.General,
            courseId: courseId ? +courseId : IsNull(),
            startDate: LessThanOrEqual(new Date()),
            // startDate: dayLimit
            //   ? Between(
            //       MoreThanOrEqual(
            //         moment(new Date())
            //           .subtract(+dayLimit, 'days')
            //           .format('YYYY-MM-DD HH:mm:ss')
            //       ),
            //       LessThanOrEqual(
            //         moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            //       )
            //     )
            //   : Between(
            //       MoreThanOrEqual(
            //         moment(new Date())
            //           .subtract(7, 'days')
            //           .format('YYYY-MM-DD HH:mm:ss')
            //       ),
            //       LessThanOrEqual(
            //         moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            //       )
            //     ),
          },
        })
      );
      console.log(err);
      if (err) throw new InternalServerErrorException(err.message);
      return gns;
    }

    const [err, gns] = await to(
      this.notificationRepository.find({
        where: {
          type: NotificationType.General,
        },
      })
    );
    if (err) throw new InternalServerErrorException(err.message);
    return gns;
  }

  async createNotification(
    createNotification: CreateNotificationDto,
    user: User
  ) {
    const {
      title,
      type,
      priority,
      courseId,
      alreadySeenIds,
      description,
      startDate,
      endDate,
    } = createNotification;

    const notification = this.notificationRepository.create({
      title,
      type,
      priority,
      courseId: +courseId,
      alreadySeenIds,
      description,
      startDate,
      endDate,
      creatorId: user.id,
    });

    const [err, res] = await to(notification.save());
    if (err) throw new InternalServerErrorException(err.message);

    return { message: 'Successfully created the notification', data: res };
  }

  async updateNotification(
    createNotification: CreateNotificationDto,
    user: User
  ) {
    const {
      id,
      title,
      type,
      priority,
      courseId,
      alreadySeenIds,
      description,
      startDate,
      endDate,
    } = createNotification;

    const [err, notification] = await to(
      this.notificationRepository.findOne(+id)
    );
    console.log(err);
    if (err) throw new InternalServerErrorException(err.message);

    if (notification) {
      notification.title = title;
      notification.type = type;
      notification.priority = priority;
      notification.courseId = +courseId;
      notification.alreadySeenIds = alreadySeenIds;
      notification.description = description;
      notification.startDate = startDate;
      notification.endDate = endDate;
      notification.modifiedBy = user.id;
    }

    const [err1, res] = await to(notification.save());
    console.log(err1);
    if (err1) throw new InternalServerErrorException(err1.message);

    return { message: 'Successfully updated the notification', data: res };
  }
}
