import uuid from 'node-uuid';
import { omit } from 'lodash';

function PrimusResponder(primus) {
  const responseCallbacks = {};

  function requestFulfilled(responseId, data) {
    this.write({
      plugin: 'primus-responder',
      responseId,
      data,
    });
  }

  function dispatchRequest(requestId, outgoingData) {
    const callback = (incomingData) => requestFulfilled(requestId, incomingData);
    this.emit('request', outgoingData, callback);
  }

  function dispatchResponse(responseId, data) {
    const [resolve, reject] = responseCallbacks[responseId];
    const error = (data) ? data.error : null;

    if (error) {
      reject(data);
    } else {
      resolve(omit(data, 'error'));
    }

    delete responseCallbacks[responseId];
  }

  function handleIncoming(packet) {
    const res = packet.data;
    let proceed = true;

    if (res.plugin && res.plugin === 'primus-responder') {
      proceed = false;

      if (res.requestId) {
        dispatchRequest(res.requestId, res.data);
      } else if (res.responseId) {
        dispatchResponse(res.responseId, res.data);
      }
    }

    return proceed;
  }

  this.writeAndWait = (data) => (
    new Promise((resolve, reject) => {
      const requestId = uuid.v4();
      const envelope = {
        plugin: 'primus-responder',
        requestId,
        data,
      };
      responseCallbacks[requestId] = [resolve, reject];
      this.write(envelope);
    })
  );

  return handleIncoming;
}

export default PrimusResponder;
