import { ApiError, config, getRndInteger } from '@src/common';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { AddScoreDto } from '../dto/scrore-board/add-scrore.dto';
import { UserDocument, UserModel } from '../models/user';
import { PaginateDto } from '../dto';
import { userRepository } from '../repositories';
import { scoreBoardSocket } from '../socket/score-board.socket';

export class ScoreBoardService {
  async generateScoreToken(user: UserDocument) {
    return jwt
      .sign({ sub: user.id }, config.score.secret, {
        expiresIn: config.score.expiration,
      })
      .toString();
  }

  async addBossScore(payload: AddScoreDto, user: UserDocument): Promise<void> {
    if (!user?.bossAppearsAt) await this.resetBossSpawnTime(user);

    if (!user?.bossAppearsAt || moment(user.bossAppearsAt).isAfter(moment()))
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'It is not time yet');

    await UserModel.updateOne(
      { id: user.id },
      { score: user.score + payload.type },
    );

    const rankings = await this.getRanking({ page: 1, limit: 10 });
    scoreBoardSocket.updateRanking(rankings.docs);
    await this.resetBossSpawnTime(user);
  }

  async resetBossSpawnTime(user: UserDocument): Promise<void> {
    await UserModel.findOneAndUpdate(
      { id: user.id },
      { bossAppearsAt: moment().add(getRndInteger(4, 5), 'minutes') },
    );
  }

  async getRanking(filter: PaginateDto) {
    return userRepository.paginate(
      {},
      {
        limit: filter.limit,
        page: filter.page,
        sort: { score: -1 },
      },
    );
  }
}

export default new ScoreBoardService();
