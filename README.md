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

### L4 Config .env for multi-stage, multi-environment

```
- create file configs/config.mogodb.js
- write config file (config.mongodb.js & .env):
  + lv0: for only one environment
  + lv1: for multi-environment: development, production (cloud ex AWS, Onrender,...), testing

```

### L5 API register shop (sign up) - use RSA to create public and private key - use for Crypto or Stock market

Pseudocode

```pseudo
1. Client sends POST request to /signup with shop details (name, email, password).
2. AccessController.signUp(req, res, next)
   - Log request body
   - Call AccessService.signUp(req.body)
3. AccessService.signUp({ name, email, password })
   - Check if email exists in shopModel
     - If exists, return error response
   - Hash password using bcrypt
   - Create new shop in shopModel
   - Generate privateKey and publicKey using crypto.generateKeyPairSync("rsa", ...)
   - Log generated keys
   - Create key token in KeyTokenService with new shop ID and keys
     - If fails, return error response
   - Create token pair using createTokenPair with new shop ID, email, and keys
   - Log created tokens
   - Return success response with shop info and tokens
4. AccessController sends response to client
```

### L5 API register shop (sign up) - create random private and public key

```pseudo
3. AccessService.signUp({ name, email, password })
  ...
   - Generate privateKey and publicKey using crypto.randomBytes(64).toString("hex")
  ...
```

### L6 Custom Dynamic Middleware for ApiKey and Permission

- Flow of "Custom Dynamic Middleware for ApiKey and Permission"

```pseudo
1. Incoming Request:
   - A request is made to the Express server.
2. Middleware Setup:
   - The index.js file sets up middleware for API key and permission checks.
   - The middleware functions apiKey and permissions are imported from checkAuth.js.
3. API Key Check:
   - The apiKey middleware function is executed first.
   - It retrieves the API key from the request headers (x-api-key).
   - If the API key is missing, it responds with a 403 Forbidden error.
   - If the API key is present, it calls findById from apikey.service.js to check if the key exists and is active in the database.
   - If the key is not found or inactive, it responds with a 403 Forbidden error.
   - If the key is valid, it attaches the key object (objKey) to the request object (req.objKey) and calls next() to proceed to the next middleware.
4. Permission Check:
  - The permissions middleware function is executed next.
  - It checks if the objKey attached to the request has the required permissions.
  - If the permissions are missing or invalid, it responds with a 403 Forbidden error.
  - If the permissions are valid, it calls next() to proceed to the next middleware or route handler.
5. Route Handling:
  - If both middleware checks pass, the request is routed to the appropriate handler (e.g., /v1/api).
```

### L7: Error Handling

### L8: Success Response

Step by Step to format response

```pseudo
- Write formatResponse classes in core/success.response.js and core/error.response.js
- Use formatResponse in Controller
```

### L9: API Login Shop

Step By Step

```pseudo
1. Check mail exists in DB
2. Check password
3. Create AccessToken và RefreshToken and save to DB
4, Generate Tokens and save refresh token to DB
5. Get Data return Login
```

### L10: Logout Shop and Authentication

Check Authentication

```pseudo
1 - Check userId missing???
    2 - get accessToken
    3 - verifyToken
    4 - check user in DB
    5 - check keyStore with this userID
    6 - OK all => return next()
```

Logout

```pseudo

```

### L11: Handle Refresh Token

```pseudo
1. Check refreshToken
- If refreshToken is used -> Illegal Refresh Token -> Delete allToken in DB (accessToken, refreshToken in KeyStore collection)
- If refreshToken is not used and the same with DB -> create new accessToken and refreshToken
```

- L11 v2: fix logic bug - authentication v2

```pseudo
- Right: can use refreshToken without authentication
```
