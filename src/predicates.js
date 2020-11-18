'use strict';

// Some help with making domain-specific predicates.
// Could potentiall enhance this in the future.

function standard(fn) {
  return {
    allPredicates: [
      m => m.event.Event !== "Registry",
      m => m.event.Event !== "PeerStatus"
    ],
    action: fn
  };
}

module.exports = {
  standard
};
