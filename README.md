#super-object-mapper

Sup-ed up object-level schema control - whitelist fields and convert between types and keys.

Much thanks and credit are due to [wankdanker's node-object-mapper](https://github.com/wankdanker/node-object-mapper).
This module is essentially an API and Type-enforcement layer on top of it.

#Philosophy

##Use-Cases

It is often desirable to enforce an object mapping or schema at an application's interfaces,
typically between app logic and a **Database** or a **Client**. 

An object mapper can deal with issues where your app's consumers: 

- Need to limit an object to a subset of fields
- Prefer different data types than you want to work with
- Use legacy field names that you want to move away from

##Intent

Notably, the above use-cases can all be accomplished with [wankdanker's node-object-mapper](https://github.com/wankdanker/node-object-mapper).
After building a handful of apps with this module,
a few patterns popped up - Super Object Mapper intends to present those patterns with a tighter API.

#API

