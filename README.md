### L2 Create project folder

- code base

```
- npm init -y, install express
- create project folder
- code app and server.js
- node --watch server.js
```

- install and test packages

```
- morgan: log 5 modes: dev, combined, common, short, tiny
- helmet: protect my HEADer
- compression: compress my response
```

### L3 Connect Mongo DB to Node

1. Connect to MongoDB (without design pattern)

```
- create folder dbs/init.mongodb.lv0.js
"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/shop";
// if meet "MongooseServerSelectionError: connect ECONNREFUSED ::1:27017" try to use "mongodb://127.0.0.1:27017/shop" instead

mongoose
  .connect(connectString)
  .then((_) => console.log("Connected mongodb success"))
  .catch((err) => console.log(err));

module.exports = mongoose;

```

2. Connect to MongoDB (with singleton design pattern)

3. Check the Number of Connections to MongoDB server

```
- create file /src/helpers/check.connect.js
- write countConnect function
- import "countConnect" to app.js
```

4. Alert when server is overloading

```
- use "os" package to check the number of cpus
- write "checkOverload" function
- import "checkOverload" to app.js
- numConnections should be alert when >= maxConnections - 10  to have time to fix
```

5. Poolsize and Pooling

```
- maxPoolSize defaults to 100
- Understand how PoolSize work - a pool of connections - work like a queue
- Update file init.mongodb.js

```
