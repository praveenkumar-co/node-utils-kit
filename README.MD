# NODE-UTILS-KIT 

Modern, lightweight utilities for building Node.js APIs with clean error handling and predictable responses.

Includes:

ApiError
ApiResponse
asyncHandler
errorHandler

Designed for framework-agnostic usage (Express, Fastify, custom Node servers).

# Framework Compatibility 

Node Utils Kit  is not tied to any framework and can be used with any framework 
: express
: Fastify 
: Custom Node JS Application 


# Design Principles

1 . Framework-agnostic
2 . Type-safe by default
3 . Minimal surface area
4 . Predictable behavior
5 . Production-ready utilities

# INSTALLATION 

```bash
npm install node-utils-kit
```

# USAGE 

```javascript
const { asyncHandler } = require("node-utils-kit");
```

# API 

## ApiResponse 

```javascript
const response = new ApiResponse(200, { message: "success" });
```

## ApiError 

```javascript
const error = new ApiError(400, "Bad Request");
```

## errorHandler 

```javascript
const errorHandler = require("node-utils-kit").errorHandler;
``` 

# Examples 
import {ApiError , AsyncHandler} from "node-utils-kit"; 
app.get("/user",AsyncHandler(async(req,res)=>{
    const user = null ;
    if(!user){
      throw new ApiError(404,"User Not Found");
    } 
    res.json(user);
}))
import {errorHandler} from "node-utils-kit";

try{
   throw new ApiError(401,"Unauthorized");
}catch(error){
    errorHandler(error , req , res , next);
}

# LICENSE 

MIT License

Copyright (c) 2025
Praveen Kumar


