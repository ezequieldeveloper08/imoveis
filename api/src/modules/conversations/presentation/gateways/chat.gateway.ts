import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  handleConnection(client: Socket) {
    const organizationId = client.handshake.query.organizationId as string;
    if (organizationId) {
      client.join(organizationId);
      this.logger.log(`[Socket] Client connected: ${client.id} joined room: ${organizationId}`);
    } else {
      this.logger.warn(`[Socket] Client connected without organizationId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[Socket] Client disconnected: ${client.id}`);
  }

  emitNewMessage(organizationId: string, message: any) {
    this.logger.log(`[Socket] Emitting new_message to org ${organizationId}: ${message.content || 'media'}`);
    this.server.to(organizationId).emit('new_message', message);
  }

  emitConversationUpdated(organizationId: string, conversation: any) {
    this.logger.log(`[Socket] Emitting conversation_updated to org ${organizationId}`);
    this.server.to(organizationId).emit('conversation_updated', conversation);
  }
}
