'use strict';

const EventEmitter = require('events');

require('events').EventEmitter.defaultMaxListeners = 0

class CountEmitter extends EventEmitter{
}
const SingleCountEmitter = new CountEmitter();
export default SingleCountEmitter;
