const userIP = (request) => {
  if (request.headers['x-forwarded-for']) {
    return ({
      ip: request.headers['x-forwarded-for'],
      type: 'header',
    });
  } else if (request.connection && request.connection.remoteAddress) {
    return ({
      ip: request.connection.remoteAddress,
      type: 'connection-remote-address',
    });
  } else if (request.socket && request.socket.remoteAddress) {
    return ({
      ip: request.socket.remoteAddress,
      type: 'socket-remote-address',
    });
  } else {
    return ({error: 'Unable to detect IP Address'});
  }
};

module.exports = userIP;
