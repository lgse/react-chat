import PrimusResponder from './PrimusResponder';
import { extend } from 'lodash';

const { Primus } = window;
const _initialise = Primus.prototype.initialise;

Primus.prototype.initialise = function initialise(...args) {
  const transformer = PrimusResponder.call(this);
  this.transform('incoming', transformer);
  _initialise.apply(this, args);
};

export default Primus;
