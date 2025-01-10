import { UserDocument, UserModel } from '@src/app/models/user';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract-repository';

export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(protected readonly userModel: Model<UserDocument>) {
    super(userModel);
  }
}

export const userRepository = new UserRepository(UserModel);
