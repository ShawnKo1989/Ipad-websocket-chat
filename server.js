const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
// 웹소켓 서버 생성 (CORS 설정을 public으로 열어두어 프론트작업자가 접속할수잇게 함)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
//클라이언트가 웹소켓으로 접속했을 때 실버되는 이벤트 
io.on('connection', (socket) => {
    console.log('유저가 접속했습니다. 소켓 아이디 : ', socket.id);
    // 프론트엔드 작업자가 보낸 '화상채팅 신호(메시지)'를 받아서 다른 사람에게 전달하는 리스너
    socket.on('signal', (data) => {
      // 나를 제외한 방 안의 다른 사람들에게 신호 전달(시그널링)
      socket.broadcast.emit('signal', data);
    });

    //접속이 끊겼을때
    socket.on('disconnect',() => {
      console.log('유저가 접속을 끊었습니다. 소켓 아이디 : ', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});