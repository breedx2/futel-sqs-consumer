# futel-sqs-consumer
Provides easy consumption of futel SQS events

**NOTE:** This is not really a general-purpose library, don't expect it to
just freely provide access to all events.

This exists primarily to make reading events simpler and to enable
building of apps based on the event stream.

# example

See [src/app.js](app.js) for the full example.  

You create an instance of `FutelSqsConsumer` (use the builder),
and tell it to just run forever.  When it gets a message, it will see if
there are any handlers for that message and will dispatch appropriately.
It then deletes the message from the queue so that it is not processed again.

# handlers

A predicated handler sounds complicated, but it just a collection of functions
that return true/false for a message, and another function to run if the
predicates pass.  Right now, only "all" is supported, so all predicates must
return true before handler is invoked.

```javascript
{
  allPredicates: [p1, p2, ..., pn]
  action: handlerFunction
}
```

where `p1`...`pn` are predicates, and `handlerFunction` receives a message
when all predicates are satisfied.
