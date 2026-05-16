import { Server } from 'socket.io';

export function initSocket(server, app) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
}
