import scoreBoardService from '@src/app/services/score-board.service';
import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '@src/common/types/type';
import httpStatus from 'http-status';

export class ScoreBoardController {
  async generateScoreToken(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const data = await scoreBoardService.generateScoreToken(req.user);
      res.status(httpStatus.OK).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async addScore(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      await scoreBoardService.addBossScore(req.body, req.user);
      res.status(httpStatus.OK).json({ message: 'Added core successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getRanking(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const data = await scoreBoardService.getRanking(req.query);
      res.status(httpStatus.OK).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

export const scoreBoardController = new ScoreBoardController();
