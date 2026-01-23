## node-utils-kit

node-utils-kit is a lightweight, framework-agnostic utility toolkit for building Node.js APIs with clean error handling, safe async flows, predictable responses, and request-scoped context.

It is written in TypeScript, published as ESM + CJS, and designed to work with Express, Fastify, NestJS, or plain Node.js.

---

## Why This Package Exist 

- Wrapping async routes safely
- Creating consistent API responses
- Handling errors centrally
- Passing request metadata (requestId, userId) across async layers

---

## Features

- Framework-agnostic design
- First-class TypeScript support
- Predictable and consistent API responses
- Centralized and safe async error handling
- Minimal surface area with zero-overhead utilities
- Minimal API surface (easy to learn, hard to misuse)

---

## The package provides the following exports:

- ApiError

- ApiResponse

- asyncHandler

- errorHandler

- withContext

- getContext

- setContext

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

-> CommonJS

```bash

const { asyncHandler,
  ApiError,
  ApiResponse,
  errorHandler,
  withContext,
  getContext,
  setContext } = require("node-utils-kit");

-> ES Modules / TypeScript

import {
  asyncHandler,
  ApiError,
  ApiResponse,
  errorHandler,
  withContext,
  getContext,
  setContext,
} from "node-utils-kit";

```

### Examples 


```Express```

 1.Safe Async Handling (asyncHandler)

```Javascript 
import express from "express";
import { asyncHandler, ApiError } from "node-utils-kit";

const app = express();

app.get(
  "/user",
  asyncHandler(async (req, res) => {
    const user = null;

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(user);
  })
);

app.listen(3000);

2. Standard API Responses (ApiResponse)
  
import { ApiResponse } from "node-utils-kit";

res.status(200).json(
  new ApiResponse(200, { id: 1, name: "Praveen" }, "Success")
);


3. Centralized Errors (ApiError + errorHandler)

 import { errorHandler } from "node-utils-kit";

app.use((err, req, res, next) => {
  const result = errorHandler(err);
  res.status(result.statusCode).json(result.body);
});


4. Request Context (AsyncLocalStorage)

 (Store and access request-scoped data without passing req everywhere.)

import { withContext } from "node-utils-kit";

export const requestContextMiddleware = (req, res, next) => {
  withContext(
    {
      requestId: req.headers["x-request-id"] || `req-${Date.now()}`,
      userId: req.headers["x-user-id"],
      extras: { role: "admin" },
    },
    () => next()
  );
};

 Read Context Anywhere

import { getContext } from "node-utils-kit";
const ctx = getContext();
console.log(ctx.requestId);
console.log(ctx.userId);
console.log(ctx.extras);

---

 ```NestJS```

1. ```request-context.middleware.ts```

import { Injectable, NestMiddleware } from "@nestjs/common";
import { withContext } from "node-utils-kit";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    withContext(
      {
        requestId: req.headers["x-request-id"] || `req-${Date.now()}`,
        userId: req.user?.id,
      },
      () => next()
    );
  }
}

2. app.module.ts 

import { Module, MiddlewareConsumer } from "@nestjs/common";
import { RequestContextMiddleware } from "./request-context.middleware";
import { UserController } from "./user.controller";

@Module({
  controllers: [UserController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}

3. user.controller.ts

@Controller("user") 
export class UserController {
  @Get()
  async getUser() {
    const ctx = getContext();
    console.log(ctx.requestId);
    console.log(ctx.userId);
    console.log(ctx.extras);
    return "User";
  }
}
---

 ```Fastify``` 

1. app.js

import Fastify from "fastify";
import { withContext, getContext, ApiError } from "node-utils-kit";

const app = Fastify();

app.addHook("onRequest", (req, reply, done) => {
  withContext(
    {
      requestId: req.headers["x-request-id"] || `req-${Date.now()}`,
    },
    () => done()
  );
});

app.get("/user", async (req, reply) => {
  const ctx = getContext();
  console.log("Request ID:", ctx.requestId);

  if (!ctx.requestId) {
    throw new ApiError(400, "Missing request context");
  }

  reply.send({ success: true, id: 1 });
});

app.listen({ port: 3000 });
 
---

```Plain Node.js HTTP Server``` 

1. server.js
import http from "http";

import { withContext, getContext, ApiError } from "node-utils-kit";

const server = http.createServer((req, res) => {
  withContext(
    {
      requestId: req.headers["x-request-id"] || `req-${Date.now()}`,
    },
    async () => {
      const ctx = getContext();
      console.log("Request ID:", ctx.requestId);

      if (req.url === "/user") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, id: 1 }));
        return;
      }
      throw new ApiError(404, "Route not found");
    }
  );
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

## License

MIT License

Copyright (c) 2025
Praveen Kumar
