// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

/*
  +--------------------------------------------------+
  | Binary broadcast WebSocket server in pure NodeJs |
  +--------------------------------------------------+

  Based on great article created by Srushtika Neelakantam:
  https://medium.com/hackernoon/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8

  Differences to the article:
   - supports only binary frames (max payload length < 64 KiB)
   - supports HTTPS/WSS
   - WebSocket frames are parsed even if NodeJs buffer chunks are not aligned
   - supports fragmented frames but message is split into smaller messages
   - sends received data in the broadcast mode to all connected clients
 */

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const IS_HTTPS = false;
const PORT = 5612;
const HTTP_426_UPGRADE_REQUIRED = 426;
let connectedSockets = [];

/*
    Self-signed certificate solution:
      - https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/

      openssl genrsa -out key.pem
      openssl req -new -key key.pem -out csr.pem
      openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
      rm csr.pem

    Let's Encrypt solution:
    - https://advancedweb.hu/how-to-use-lets-encrypt-with-node-js-and-express/
    - https://stackoverflow.com/questions/48078083/lets-encrypt-ssl-couldnt-start-by-error-eacces-permission-denied-open-et
 */
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const requestListener = (localRequest, localResponse) => {
  localRequest.on('data', () => undefined);

  localRequest.on('end', () => {
    console.log('[normal HTTP request]\n');

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

const server = IS_HTTPS ? https.createServer(options, requestListener) : http.createServer(requestListener);

server.listen(PORT, '0.0.0.0');

if (server) {
  [
    '',
    '------------------------------------',
    '       :: WebSocket server ::       ',
    '------------------------------------',
    '',
    'Waiting for first call on port ' + PORT,
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
  let bufferToParse = Buffer.alloc(0);

  socket.on('data', buffer => {
    let parsedBuffer;

    bufferToParse = Buffer.concat([bufferToParse, buffer]);

    do {
      parsedBuffer = getParsedBuffer(bufferToParse);

      console.log(':: DEBUG - buffer | ' + buffer.length, ' | ', buffer, '\n');
      console.log(':: DEBUG - bufferToParse | ' + bufferToParse.length, ' | ', bufferToParse, '\n');
      console.log(':: DEBUG - parsedBuffer.payload | ' + (parsedBuffer.payload ? parsedBuffer.payload.length : '---'), ' | ', parsedBuffer.payload, '\n');
      console.log(':: DEBUG - parsedBuffer.bufferRemainingBytes | ' + parsedBuffer.bufferRemainingBytes.length, ' | ', parsedBuffer.bufferRemainingBytes, '\n');

      bufferToParse = parsedBuffer.bufferRemainingBytes;

      if (parsedBuffer.payload) {
        connectedSockets = connectedSockets.filter(connectedSocket => connectedSocket.readyState === 'open');

        console.log('[sending payload to ' + connectedSockets.length + ' active connection(s)] ' + parsedBuffer.payload.length, ' | ', parsedBuffer.payload, '\n');

        connectedSockets.forEach(connectedSocket => connectedSocket.write(createWebSocketFrame(parsedBuffer.payload)));
      }
    } while (parsedBuffer.payload && parsedBuffer.bufferRemainingBytes.length);

    console.log('----------------------------------------------------------------\n');
  });

  socket.on('close', () => console.log('[socket close]\n'));
  socket.on('connect', () => console.log('[socket connect]\n'));
  socket.on('drain', () => console.log('[socket drain]\n'));
  socket.on('end', () => console.log('[socket end]\n'));
  socket.on('ready', () => console.log('[socket ready]\n'));
  socket.on('error', () => console.log('[socket error]\n'));
  socket.on('timeout', () => console.log('[socket timeout]\n'));
  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');

  console.log('[new connection]\n');

  connectedSockets.push(socket);
});

// ---------------------------------------------------------

const createWebSocketFrame = payload => {
  const payloadLengthByteCount = payload.length < 126 ? 0 : 2;
  const buffer = Buffer.alloc(2 + payloadLengthByteCount + payload.length);
  let payloadOffset = 2;

  if (payload.length >= Math.pow(2, 16)) {
    throw new Error('Payload equal or bigger than 64 KiB is not supported');
  }

  buffer.writeUInt8(0b10000010, 0); // FIN flag = 1, opcode = 2 (binary frame)
  buffer.writeUInt8(payload.length < 126 ? payload.length : 126, 1);

  if (payloadLengthByteCount > 0) {
    buffer.writeUInt16BE(payload.length, 2);
    payloadOffset += payloadLengthByteCount;
  }

  payload.copy(buffer, payloadOffset);

  return buffer;
};

// ---------------------------------------------------------

const getParsedBuffer = buffer => {
  let bufferRemainingBytes;
  let currentOffset = 0;
  let maskingKey;
  let payload;

  if (currentOffset + 2 > buffer.length) {
    return { payload: null, bufferRemainingBytes: buffer };
  }

  const firstByte = buffer.readUInt8(currentOffset++);
  const secondByte = buffer.readUInt8(currentOffset++);
  const isFinalFrame = !!((firstByte >>> 7) & 0x1);
  const opCode = firstByte & 0xf;
  const isMasked = !!((secondByte >>> 7) & 0x1); // https://security.stackexchange.com/questions/113297
  let payloadLength = secondByte & 0x7f;

  if (!isFinalFrame && opCode !== 0x0) {
    throw new Error('Invalid frame detected - when frame is not final then opcode should be always 0');
  }

  if (opCode !== 0x2 && opCode !== 0x0) {
    throw new Error('Only binary and continuation frames are supported');
  }

  if (payloadLength > 125) {
    if (payloadLength === 126) {
      if (currentOffset + 2 > buffer.length) {
        return { payload: null, bufferRemainingBytes: buffer };
      }
      payloadLength = buffer.readUInt16BE(currentOffset);
      currentOffset += 2;
    } else {
      throw new Error('Payload equal or bigger than 64 KiB is not supported');
    }
  }

  if (isMasked) {
    if (currentOffset + 4 > buffer.length) {
      return { payload: null, bufferRemainingBytes: buffer };
    }
    maskingKey = buffer.readUInt32BE(currentOffset);
    currentOffset += 4;
  }

  if (currentOffset + payloadLength > buffer.length) {
    console.log('[misalignment between WebSocket frame and NodeJs Buffer]\n');
    return { payload: null, bufferRemainingBytes: buffer };
  }

  payload = Buffer.alloc(payloadLength);

  if (isMasked) {
    for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
      const shift = j === 3 ? 0 : (3 - j) << 3;
      const mask = (shift === 0 ? maskingKey : maskingKey >>> shift) & 0xff;

      payload.writeUInt8(mask ^ buffer.readUInt8(currentOffset++), i);
    }
  } else {
    for (let i = 0; i < payloadLength; i++) {
      payload.writeUInt8(buffer.readUInt8(currentOffset++), i);
    }
  }

  bufferRemainingBytes = Buffer.alloc(buffer.length - currentOffset);
  for (let i = 0; i < bufferRemainingBytes.length; i++) {
    bufferRemainingBytes.writeUInt8(buffer.readUInt8(currentOffset++), i);
  }

  return { payload, bufferRemainingBytes };
};

// ---------------------------------------------------------

const getSecWebSocketAccept = acceptKey => {
  // WFT is this long GUID? Answer below ;)
  // https://stackoverflow.com/questions/13456017

  return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
};
