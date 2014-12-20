#super-object-mapper

Sup-ed up object-level schema control - whitelist fields and convert between types and keys.

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
    "email": "email"
  },
  "domain": {
    "_id": "id",
    "name": "name",
    "email": "email"
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
var databaseObject = superOM.mapObject("domain", "users", object);

console.log(databaseObject);
//databaseObject now == {
//  _id: "123456abcdef654321fedcba",
//  name: "Mario",
//  email: "mario@toadstool.com"
//}
```

Only the fields specified by the mapper will survive the mapping.

You can optionally pass a 4th `options` parameter, which defaults as follows:

```
options: {
  clean: false // if `true`, `.mapObject` will remove falsy values from the mapped object
}
```

If the specifed map or mapper do not exist, an error will be thrown.

If the object passed is falsy, `null` will be returned.

#Future

Coming soon is a set of transformers for built-in data type handling in the Mappers. Essentially:

```
userMapper = {
  "database": {
    "id": superOM.mongoId("_id")
  },
  "domain": {
    "_id": superOM.string("id")
  }
}
```

#Development

Feel free to contribute! Open to any PRs.
