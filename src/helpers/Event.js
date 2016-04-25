class Event {
  constructor(type, payload = {}) {
    return {
      action: 'event',
      data: Object.assign({ type }, payload),
    };
  }
}

export default Event;
