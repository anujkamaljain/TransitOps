import { io, type Socket } from "socket.io-client"
import { env } from "@/lib/env"

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    })
  }
  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
