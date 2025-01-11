import { logger } from '@src/common/config/logger.config';
import { EClientToServerEvent, EServerToClientEvent } from '@src/common/enum';
import { Server, Socket } from 'socket.io';
import { socketService } from './socket';

export class ScoreBoardSocket {
  private ioInstance: Server; // eslint-disable-line @typescript-eslint/no-unused-vars
  private clients: Map<string, number> = new Map<string, number>();

  async onConnection(io: Server, socket: Socket) {
    try {
      this.ioInstance = io;
      socket.on(EClientToServerEvent.JOIN_RANKING, () =>
        this.handleJoinRanking(socket),
      );
      socket.on(EClientToServerEvent.LEAVE_RANKING, () =>
        this.handleLeaveRanking(socket),
      );
    } catch (error) {
      logger.error(error);
    }
  }

  handleJoinRanking(socket: Socket) {
    try {
      this.clients.set(socket.id, socket.data?.user?.id);
      logger.info(
        `User with ID ${socket.data?.user?.id} has joined the ranking. Socket ID: ${socket.id}`,
      );
    } catch (error) {
      logger.error(error);
    }
  }

  handleLeaveRanking(socket: Socket) {
    try {
      const userId = this.clients.get(socket.id);

      if (userId) {
        this.clients.delete(socket.id);

        logger.info(
          `User with ID ${userId} has left the ranking. Socket ID: ${socket.id}`,
        );
      } else {
        logger.warn(`Socket ID ${socket.id} not found in ranking clients.`);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  updateRanking(payload: any) {
    try {
      const socketIds = Array.from(this.clients.keys());
      if (socketIds)
        socketService.emitToSockets(
          socketIds,
          EServerToClientEvent.UPDATE_RANKING,
          payload,
        );
    } catch (error) {
      logger.error(error);
    }
  }
}

export const scoreBoardSocket = new ScoreBoardSocket();
