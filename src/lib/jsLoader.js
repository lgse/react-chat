import { flattenDeep } from 'lodash';

export default function jsLoader(src, callback) {
  const queue = [];
  let sources = [];

  if (typeof src !== 'string' && !Array.isArray(src)) {
    throw new Error('jsLoader: Source argument should be a string or an array of strings.');
  }

  sources.push(src);
  sources = flattenDeep(sources);

  function loadQueue() {
    if (queue.length) {
      queue[0]();
    }
  }

  function onLoad() {
    queue.shift();

    if (!queue.length) {
      return callback();
    }

    return loadQueue();
  }

  for (let i = 0; i < sources.length; i++) {
    queue.push(() => {
      const el = document.createElement('script');
      el.src = sources[i];
      el.addEventListener('load', onLoad);
      document.body.appendChild(el);
    });
  }

  loadQueue();
}
