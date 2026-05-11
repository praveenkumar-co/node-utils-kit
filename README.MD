# node-utils-kit

node-utils-kit is a lightweight, framework-agnostic utility toolkit for building Node.js APIs with clean error handling, safe async flows, and fully customizable response formats.

It is written in TypeScript, published as ESM + CJS, and designed to work with Express, Fastify, NestJS, or plain Node.js.

---

## Why This Package Exists

- Wrapping async routes safely
- Creating consistent API responses in any format your team defines
- Handling errors centrally
- Adapting response and error shapes without rewriting your entire codebase

---

## Features

- Framework-agnostic design
- First-class TypeScript support
- Fully customizable response and error formats via global formatter
- Centralized and safe async error handling
- Minimal surface area with zero runtime dependencies
- Minimal API surface (easy to learn, hard to misuse)

---

## The package provides the following exports:

- `ApiError`
- `ApiResponse`
- `asyncHandler`
- `errorHandler`

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

# or

yarn add node-utils-kit

# or

pnpm add node-utils-kit
```

---

## Usage

```bash
-> CommonJS

const { asyncHandler, ApiError, ApiResponse, errorHandler } = require("node-utils-kit");

-> ES Modules / TypeScript

import { asyncHandler, ApiError, ApiResponse, errorHandler } from "node-utils-kit";
```

---

## Custom Response Format (Global Formatter)

By default, `ApiResponse` outputs:

```json
{ "statusCode": 200, "data": {}, "message": "Success", "success": true }
```

If your team uses a different API contract, register a global formatter **once** at app startup. Every `ApiResponse` and `ApiError` instance across your entire codebase will automatically use it — no other changes required.

```typescript
import { ApiResponse, ApiError } from "node-utils-kit";

// Register once in app.ts or server.ts
ApiResponse.setFormatter((statusCode, data, message, success) => ({
  code: statusCode,
  payload: data,
  ok: success,
  msg: message,
}));

ApiError.setFormatter((statusCode, message, errors) => ({
  code: statusCode,
  error: message,
  details: errors,
  ok: false,
}));
```

Output of every `new ApiResponse(200, data, "Fetched")` thereafter:

```json
{ "code": 200, "payload": {}, "ok": true, "msg": "Fetched" }
```

To reset to the default format (useful in tests):

```typescript
ApiResponse.resetFormatter();
ApiError.resetFormatter();
```

---

## Examples

### Express

#### 1. Safe Async Handling (asyncHandler)

```typescript
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
```

#### 2. Standard API Responses (ApiResponse)

```typescript
import { ApiResponse } from "node-utils-kit";

res.status(200).json(
  new ApiResponse(200, { id: 1, name: "Praveen" }, "Success")
);
```

#### 3. Centralized Errors (ApiError + errorHandler)

```typescript
import { errorHandler } from "node-utils-kit";

app.use((err, req, res, next) => {
  const result = errorHandler(err);
  res.status(result.statusCode).json(result.body);
});
```

---

### NestJS

#### 1. `exception.filter.ts`

```typescript
import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { ApiError, errorHandler } from "node-utils-kit";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const result = errorHandler(exception);
    response.status(result.statusCode).json(result.body);
  }
}
```

#### 2. `user.controller.ts`

```typescript
import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "node-utils-kit";

@Controller("user")
export class UserController {
  @Get()
  async getUser() {
    return new ApiResponse(200, { id: 1, name: "Praveen" }, "Fetched");
  }
}
```

---

### Fastify

```typescript
import Fastify from "fastify";
import { ApiError, ApiResponse } from "node-utils-kit";

const app = Fastify();

app.get("/user", async (req, reply) => {
  const user = null;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  reply.send(new ApiResponse(200, { id: 1 }, "Fetched"));
});

app.listen({ port: 3000 });
```

---

### Plain Node.js HTTP Server

```typescript
import http from "http";
import { ApiError, ApiResponse } from "node-utils-kit";

const server = http.createServer((req, res) => {
  if (req.url === "/user") {
    const response = new ApiResponse(200, { id: 1 }, "Fetched");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
    return;
  }

  const error = new ApiError(404, "Route not found");
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify(error));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## Contributing

This project is a labor of love! Whether you're fixing a bug, adding a framework example, or improving docs, your help is welcome.

1. Fork the repo.
2. Create your feature branch.
3. Open a Pull Request!

Check the **Issues** tab for "good first issues" to get started!

---

## License

MIT License

Copyright (c) 2025
Praveen Kumar