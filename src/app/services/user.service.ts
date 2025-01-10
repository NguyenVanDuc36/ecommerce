import { UserDocument } from '../models/user';
import { userRepository } from '../repositories';

export class UserService {
  static async insertManyUser(docs: UserDocument[]): Promise<void> {
    await userRepository.insertMany(docs);
  }
}
