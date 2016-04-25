import Event from './Event';

class Error extends Event {
  constructor(message) {
    super('error', { message });
    return this;
  }
}

export default Error;
