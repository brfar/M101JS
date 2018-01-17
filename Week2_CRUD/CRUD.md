### Creating Documents

For creating documents we have `insertOne()` and `insertMany()` and. These are the two principal commands for creating documents in MongoDB. 

### The `_id` field

MongoDB, if we don't supply one, creates an `_id` field by
default. All collections have a unique primary index on the `_id` field. 

```
ObjectId: 5a5e8beeaef0acf887b0f369
          └──────┘└────┘└──┘└────┘
          Date    MAC   PID Counter
          12-byte Hex String
```
**Date**: 4 bytes representing the seconds since the UNIX epoch; a timestamp.

**Mac**: 3 bytes representing a machine identifier. They are the MAC address for the machine on which the
MongoDB server is running.

**PID**: 2 bytes representing the ProcessID

**Counter**: 3 bytes representing a counter to ensure that
all ObjectIDs are unique even if a couple of writes happen under a set of conditions such that the first nine bytes would end up being the same as a second right.

