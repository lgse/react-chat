const Config = {
  idleChannel: 'lounge',
  socketReconnectStrategy: {
    max: 2000,
    min: 500,
    retries: 5,
  },
};

export default Config;
