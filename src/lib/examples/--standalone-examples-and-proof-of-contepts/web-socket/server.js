// Based on great article created by Srushtika Neelakantam:
// https://medium.com/hackernoon/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8

const http = require('http');
const crypto = require('crypto');
const PORT = 5612;
const HTTP_426_UPGRADE_REQUIRED = 426;
const sockets = [];

const createServerHandler = (localRequest, localResponse) => {
  localRequest.on('data', () => undefined);

  localRequest.on('end', () => {
    console.log('[normal HTTP request]');

    localResponse.statusCode = HTTP_426_UPGRADE_REQUIRED;
    localResponse.setHeader('Upgrade', 'WebSocket');
    localResponse.setHeader('Content-Type', 'text/html; charset=UTF-8');
    localResponse.end(
      '<html>\n' +
        '  <head><link rel="icon" href="data:,"></head>\n' +
        '  <body>This service supports only WebSockets</body>\n' +
        '</html>'
    );
  });
};

server = http.createServer(createServerHandler).listen(PORT, '0.0.0.0');

if (server) {
  [
    '',
    '------------------------------------',
    '       :: WebSocket server ::       ',
    '------------------------------------',
    '',
    'Waiting for first call on localhost:' + PORT,
    ''
  ].forEach(line => console.log(line));
}

// ---------------------------------------------------------

/*
  https://tools.ietf.org/html/rfc6455#section-5.2

    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-------+-+-------------+-------------------------------+
   |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
   |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
   |N|V|V|V|       |S|             |   (if payload len==126/127)   |
   | |1|2|3|       |K|             |                               |
   +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
   |     Extended payload length continued, if payload len == 127  |
   + - - - - - - - - - - - - - - - +-------------------------------+
   |                               |Masking-key, if MASK set to 1  |
   +-------------------------------+-------------------------------+
   | Masking-key (continued)       |          Payload Data         |
   +-------------------------------- - - - - - - - - - - - - - - - +
   :                     Payload Data continued ...                :
   + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
   |                     Payload Data continued ...                |
   +---------------------------------------------------------------+

  OpCode
    %x0 denotes a continuation frame
    %x1 denotes a text frame
    %x2 denotes a binary frame
    %x3–7 are reserved for further non-control frames
    %x8 denotes a connection close
    %x9 denotes a ping
    %xA denotes a pong
    %xB-F are reserved for further control frames
*/

server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request');
    return;
  }

  const responseHeaders = [
    'HTTP/1.1 101 Web Socket Protocol Handshake',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${getSecWebSocketAccept(req.headers['sec-websocket-key'])}`,
    `Sec-WebSocket-Protocol: audio-network-reborn`
  ];

  socket.on('data', buffer => {
    const payloadReceived = getWebSocketFramePayload(buffer);

    if (payloadReceived) {
      console.log(payloadReceived, sockets.length);

      // const arrayBuffer = new ArrayBuffer(3);
      // const payloadTransmit = new Uint8Array(arrayBuffer);
      // payloadTransmit[0] = 0x10;
      // payloadTransmit[1] = 0x16;
      // payloadTransmit[2] = 0x00;

      sockets.forEach(s => s.write(createWebSocketFrame(payloadReceived)));
    }
  });

  socket.on('close', () => console.log('socket close'));
  socket.on('connect', () => console.log('socket connect'));
  socket.on('drain', () => console.log('socket drain'));
  socket.on('end', () => console.log('socket end'));
  socket.on('ready', () => console.log('socket ready'));
  socket.on('error', () => console.log('socket error'));
  socket.on('timeout', () => console.log('socket timeout'));
  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

  console.log('[new connection]', sockets.length);

  sockets.push(socket);
});

// ---------------------------------------------------------

const createWebSocketFrame = payload => {
  const payloadLengthByteCount = payload.length < 126 ? 0 : 2;
  const buffer = Buffer.alloc(2 + payloadLengthByteCount + payload.length);
  let payloadOffset = 2;

  buffer.writeUInt8(0b10000010, 0);
  buffer.writeUInt8(payload.length < 126 ? payload.length : 126, 1);

  if (payloadLengthByteCount > 0) {
    buffer.writeUInt16BE(payload.length, 2);
    payloadOffset += payloadLengthByteCount;
  }

  payload.copy(buffer, payloadOffset);

  // when buffer is ArrayBuffer
  // for (let i = 0; i < payload.length; i++) {
  //   // buffer.readUInt8(currentOffset++);
  //   buffer.writeUInt8(payload[i], 2 + payloadLengthByteCount + i);
  // }

  return buffer;
};

// ---------------------------------------------------------

const getWebSocketFramePayload = buffer => {
  const firstByte = buffer.readUInt8(0);
  const secondByte = buffer.readUInt8(1);
  const opCode = firstByte & 0xf;
  const isMasked = !!((secondByte >>> 7) & 0x1);
  let payloadLength = secondByte & 0x7f;
  let currentOffset = 2;
  let maskingKey;
  let payload;

  if (opCode !== 0x2) {
    return; // frames other than binary are not processed
  }

  if (payloadLength > 125) {
    if (payloadLength === 126) {
      payloadLength = buffer.readUInt16BE(currentOffset);
      currentOffset += 2;
    } else {
      throw new Error('Large payloads not currently implemented');
    }
  }

  payload = Buffer.alloc(payloadLength);

  if (isMasked) {
    maskingKey = buffer.readUInt32BE(currentOffset);
    currentOffset += 4;

    for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
      const shift = j === 3 ? 0 : (3 - j) << 3;
      const mask = (shift === 0 ? maskingKey : maskingKey >>> shift) & 0xff;
      const payloadByteMasked = buffer.readUInt8(currentOffset++);

      payload.writeUInt8(mask ^ payloadByteMasked, i);
    }
  } else {
    buffer.copy(payload, 0, currentOffset++);
  }

  return payload;
};

// ---------------------------------------------------------

const getSecWebSocketAccept = acceptKey => {
  return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
};
