#super-object-mapper

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/russmatney/super-object-mapper?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Flexibly enforce any schema, anytime. SuperOM is sup-ed up schema control over any object - whitelist fields and convert between types and keys at your leisure.

Many thanks and credit are due to [wankdanker's node-object-mapper](https://github.com/wankdanker/node-object-mapper).
This module is essentially an API and Type-enforcement layer on top of it,
an abstraction of a pattern that evolved at [Moveline](https://github.com/moveline).

#Install

`npm i --save super-object-mapper`

#Philosophy

##Use-Cases

It is often desirable to enforce an object mapping or schema at an application's interfaces,
typically between app logic and a **Database** or a **Client**. 

An object mapper can deal with issues where your app's consumers: 

- Need to limit an object to a subset of fields
- Prefer different data types (Ex: MongoId vs String)
- Use legacy field names that are no-longer ideal

##Intent

Notably, the above use-cases can all be accomplished with [wankdanker's node-object-mapper](https://github.com/wankdanker/node-object-mapper).
After building a handful of apps with this module,
a few patterns popped up - Super Object Mapper intends to present those patterns with a tighter API.

#Usage

You can require and create an instance of the Super Object Mapper anywhere in your app:

```
var SuperOM = require('super-object-mapper');
var superOM = new SuperOM();
```

##`superOM.addMapper(mapper, mapperName)`

Define and add mapper to any instance of `superOM` like so:

```
userMapper = {
  "database": {
    "id": "_id",
    "name": "name",
    "email": "emailAddress"
  },
  "domain": {
    "_id": "id",
    "name": "name",
    "emailAddress": "email"
  }
}

superOM.addMapper(userMapper, "users");
```

##`superOM.mapObject(mapName, mapperName, object[, options])`

You can then run any object across the mapper and map of your choosing.

```
var object = {
  id: "123456abcdef654321fedcba",
  name: "Mario",
  email: "mario@toadstool.com",
  extraneousProperty: "whatever data"
}
var databaseObject = superOM.mapObject("database", "users", object);

console.log(databaseObject);
//{
//  _id: "123456abcdef654321fedcba",
//  name: "Mario",
//  emailAddress: "mario@toadstool.com"
//}
```

Only the fields specified by the mapper will survive the mapping. Fields excplicity set to falsy falues will be carried through the mappers as null.

If the specifed map or mapper do not exist, an error will be thrown.

If the object passed is falsy, `null` will be returned.

Instead of an `object`, you may hand an `array` of `object`s to the `mapObject` function.
The mapper will be run over every object in the array,
and the fully mapped Array will be returned.

```
var array = [
  {
    id: "123456abcdef654321fedcba",
    name: "Mario",
    email: "mario@toadstool.com",
    extraneousProperty: "whatever data"
  }, {
    id: "123456abcdef654321fedcba",
    name: "Luigi",
    email: "luigi@toadstool.com",
    extraneousProperty: "whatever data"
  }
]
var databaseArray = superOM.mapObject("database", "users", array);

console.log(databaseArray);
//[
//  {
//    _id: "123456abcdef654321fedcba",
//    name: "Mario",
//    emailAddress: "mario@toadstool.com"
//  },{
//    _id: "123456abcdef654321fedcba",
//    name: "Luigi",
//    emailAddress: "luigi@toadstool.com"
//  }
//]
```

###options

You can optionally pass a 4th `options` parameter, which defaults as follows:

```
options = {
  clean: false // if `true`, `.mapObject` will remove falsy values from the mapped object
}
```

##SuperOMType

`super-object-mapper` provides a set of built-in datatype handlers. These types can be implemented in your mappers as follows:

```
superOMType = require('super-object-mapper').Types;

userMapper = {
  "database": {
    "id": superOMType.objectId("_id")
  },
  "domain": {
    "_id": superOMType.string("id")
  }
}
```

These wrappers will cast your data type as the specified type, with the exception of `falsy` values, which will always be passed across the mappers as `null`.

###`.string(key)`

Converts any value passed to a String.

###`.objectId(key)`

Currently this depends on the `ObjectID` provided by `mongodb-core.BSON` (TODO: add links).

#Development

Feel free to contribute! Open to any PRs.

Run tests with `npm test`.
