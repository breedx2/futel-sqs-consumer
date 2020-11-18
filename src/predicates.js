'use strict';

// Some help with making domain-specific predicates.
// Could potentiall enhance this in the future.

function standard(fn) {
  return {
    allPredicates: [
      unwanted("Registry"),
      unwanted("PeerStatus")
    ],
    action: fn
  };
}

function unwanted(name){
  return m => m.event.Event !== name;
}

module.exports = {
  standard
};
