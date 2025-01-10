import {
  ExtendedNextFunction,
  ExtendedRequest,
  ExtendedResponse,
} from '@src/common/types/type';
import scoreBoardService from '../services/score-board.service';

export class ScoreBoardController {
  static async generateScoreToken(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const data = await scoreBoardService.generateScoreToken(req.user);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  static async addScore(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      await scoreBoardService.addBossScore(req.body, req.user);
      res.json({ message: 'Added core successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getRanking(
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: ExtendedNextFunction,
  ) {
    try {
      const data = await scoreBoardService.getRanking(req.query);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
