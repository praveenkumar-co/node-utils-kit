# node-utils-kit

`node-utils-kit` is a lightweight, framework-agnostic utility toolkit for building Node.js APIs with clean error handling and predictable responses. It is fully written in TypeScript and works seamlessly with Express, Fastify, NestJS, and custom HTTP servers.

---

## Features

- Framework-agnostic design
- First-class TypeScript support
- Predictable and consistent API responses
- Centralized and safe async error handling
- Minimal surface area with zero-overhead utilities

The package provides the following exports:

- ApiError  
- ApiResponse  
- asyncHandler  
- errorHandler  

---

## Framework Compatibility

This package does not depend on any specific web framework. It supports:

- Express  
- Fastify  
- NestJS  
- Custom Node.js HTTP applications  

---

## Installation

```bash
npm install node-utils-kit

or 

yarn add node-utils-kit

or 
pnpm add node-utils-kit
```

## Usage

### CommonJS
const { asyncHandler, ApiError, errorHandler } = require("node-utils-kit");

### ES Modules / TypeScript
import { asyncHandler, ApiError, errorHandler, ApiResponse } from "node-utils-kit";

## Examples

### Express

```javascript
const express = require("express");
const { asyncHandler, ApiError, errorHandler } = require("node-utils-kit");

const app = express();

app.get("/user", asyncHandler(async (req, res) => {
    const user = null;
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    res.json(user);
}));

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
```

### Fastify

```javascript
const fastify = require("fastify");
const { asyncHandler, ApiError, errorHandler } = require("node-utils-kit");

const app = fastify();

app.get("/user", asyncHandler(async (req, reply) => {
    const user = null;
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    reply.send(user);
}));

app.setErrorHandler(errorHandler);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
```

### NestJS

```typescript
import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { asyncHandler, ApiError, errorHandler } from "node-utils-kit";

@Controller("user")
export class UserController {
    @Get()
    @UseInterceptors(errorHandler)
    async getUser() {
        const user = null;
        if (!user) {
            throw new ApiError(404, "User Not Found");
        }
        return user;
    }
}
```

### Custom Node.js HTTP Server

```javascript
const http = require("http");
const { asyncHandler, ApiError, errorHandler } = require("node-utils-kit");

const server = http.createServer(asyncHandler(async (req, res) => {
    const user = null;
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    res.end(JSON.stringify(user));
}));

server.on("error", errorHandler);

server.listen(3000, () => {
    console.log("Server started on port 3000");
});
```

## API

### ApiResponse

```typescript
const response = new ApiResponse(200, { message: "success" });
```

### ApiError

```typescript
const error = new ApiError(400, "Bad Request");
```

### errorHandler

```typescript
const errorHandler = require("node-utils-kit").errorHandler;
``` 

## Examples

```javascript
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
```

## License

MIT License

Copyright (c) 2025
Praveen Kumar
