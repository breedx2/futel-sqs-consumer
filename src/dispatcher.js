'use strict';

class FutelMessageDispatcher {

  constructor(sinks){
    this.sinks = sinks;
  }

  dispatchMessages(messages){
    messages.map(m => m.message)
            .forEach(m => this.dispatch(m));
    return messages;
  }

  dispatch(msg){
    this.sinks.forEach(sink => this._maybeDispatch(sink, msg));
  }

  _maybeDispatch(sink, msg){
    sink.allPredicates &&
      this._matchAll(sink.allPredicates, msg) &&
        sink.action(msg);

    //TODO: But what about anyPredicates too!?
  }

  _matchAll(predicates, msg){
    return (predicates.length == 0) ||
      (predicates[0](msg) &&
        this._matchAll(predicates.slice(1), msg)); // tail recursion
  }

}

module.exports = FutelMessageDispatcher;
