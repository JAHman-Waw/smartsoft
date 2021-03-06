import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  transports: ["websocket"],
  path: "/" + process.env.URL_PREFIX + "/_socket",
  namespace: "/" + process.env.URL_PREFIX
})
export class StreamGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  clients = {};
  senders = {};

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("register")
  handleRegister(
    @MessageBody() data: { streamId: string; mode: "sender" | "client" },
    @ConnectedSocket() user: Socket
  ) {
    if (data.mode === "sender") {
      this.addSender(user.id, data.streamId);
      this.server.emit(data.streamId + '_sender', user.id);
    }

    return this.senders[data.streamId];
  }

  @SubscribeMessage("watcher_begin")
  handleWatcherBegin(
      @MessageBody() data: { streamId },
      @ConnectedSocket() user: Socket
  ) {
    this.server.emit(data.streamId + '_watcher', user.id);
  }

  @SubscribeMessage("offer_create")
  handleOfferCreate(
      @MessageBody() data: { streamId: string; offer: RTCSessionDescriptionInit, clientId: string },
      @ConnectedSocket() user: Socket
  ): void {
    this.server.to(data.clientId).emit(data.streamId + "_offer", data.offer);
  }

  @SubscribeMessage("answer_create")
  handleAnswerCreate(
      @MessageBody() data: { streamId: string; answer: RTCSessionDescriptionInit },
      @ConnectedSocket() user: Socket
  ): void {
    this.server.emit(data.streamId + "_answer", {
      clientId: user.id,
      answer: data.answer
    });
  }

  @SubscribeMessage("candidate_create")
  handleCandidateCreate(
      @MessageBody() data: { streamId: string; candidate: RTCIceCandidate },
      @ConnectedSocket() user: Socket
  ): void {
    this.server.emit(data.streamId + "_candidate", {
      clientId: user.id,
      candidate: data.candidate
    });
  }

  @SubscribeMessage("unregister")
  handleUnregister(
      @MessageBody() data: { streamId: string; mode: "sender" | "client" },
      @ConnectedSocket() user: Socket
  ): void {
    if (data.mode === "client") {
      this.removeClient(user.id, data.streamId);
    }

    if (data.mode === "sender") {
      this.removeSender(user.id, data.streamId);
    }
  }

  afterInit(server: any): void {
    console.log("StreamGateway Init");
  }

  handleConnection(user: any, ...args: any[]): void {
    console.log(`User connected: ${user.id}`);
  }

  handleDisconnect(user: any): void {
    console.log(`User disconnected: ${user.id}`);

    this.clearClientsAndSenders(user.id);
  }

  private addClient(clientId: string, streamId: string): void {
    if (!this.clients[streamId]) {
      this.clients[streamId] = {};
    }

    this.clients[streamId][clientId] = {};
  }

  private addSender(senderId: string, streamId: string): void {
    if (!this.senders[streamId]) {
      this.senders[streamId] = {};
    }

    this.senders[streamId][senderId] = {};
  }

  private removeClient(clientId: string, streamId: string): void {
    if (!this.clients[streamId]) return;

    delete this.clients[streamId][clientId];

    if (!Object.keys(this.clients[streamId]).length) {
      delete this.clients[streamId];
    }
  }

  private removeSender(senderId: string, streamId: string) {
    if (!this.senders[streamId]) return;

    delete this.senders[streamId][senderId];

    this.server.emit(streamId + "_disconnect");

    if (!Object.keys(this.senders[streamId]).length) {
      delete this.senders[streamId];
    }
  }

  private clearClientsAndSenders(userId: any): void {
    Object.keys(this.clients).forEach(streamId => {
      if (this.clients[streamId] && this.clients[streamId][userId]) {
        this.removeClient(userId, streamId);
      }
    });

    Object.keys(this.senders).forEach(streamId => {
      if (this.senders[streamId] && this.senders[streamId][userId]) {
        this.removeSender(userId, streamId);
      }
    });
  }
}
