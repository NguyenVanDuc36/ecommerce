import { ApiError } from '@src/common';
import { logger } from '@src/common/config/logger.config';
import { NextFunction } from 'express';
import http from 'http';
import httpStatus from 'http-status';
import { Server, Socket } from 'socket.io';
import { authService } from '../services/auth.service';
import { scoreBoardSocket } from './score-board.socket';

export class SocketService {
  private ioInstance: Server;

  connect(httpServer: http.Server) {
    this.ioInstance = new Server(httpServer, {
      cors: {
        methods: ['GET', 'POST'],
        origin: '*',
        credentials: true,
      },
      allowEIO3: true,
      allowUpgrades: true,
      transports: ['websocket', 'polling'],
    });

    this.ioInstance
      .use(this.auth.bind(this))
      .on('connection', this.onConnection.bind(this));
  }

  getIoInstance(): Server {
    return this.ioInstance;
  }

  private async auth(socket: Socket, next: NextFunction) {
    try {
      const accessToken = socket.handshake.headers?.authorization;
      if (accessToken) {
        const user = await authService.verifyAccessToken(accessToken);

        if (!user) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
        }
        socket.data.user = user;
        next();
      } else {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }
    } catch (error) {
      logger.error(`Auth Error: ${error.message}`);
      next(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Authentication Failed'),
      );
    }
  }

  emitToSockets(socketIds: string[], eventName: string, payload: any) {
    if (!this.ioInstance) logger.error('Socket.IO instance is not initialized');

    this.ioInstance.to(socketIds).emit(eventName, payload);
  }

  private async onConnection(socket: Socket) {
    scoreBoardSocket.onConnection(this.ioInstance, socket);
    socket.on('disconnect', () => this.onSocketDisconnected(socket));
  }

  private onSocketDisconnected(socket: Socket) {
    socket.disconnect();
    logger.info(`Client [${socket.id}] disconnected`);
  }
}

export const socketService = new SocketService();
