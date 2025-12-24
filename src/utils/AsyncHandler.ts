export type NextFn = (error?: unknown) => void;

export type AsyncHandler<TReq = unknown, TRes = unknown> = (
  req: TReq,
  res: TRes,
  next: NextFn,
) => Promise<unknown>;

export const asyncHandler =
  <TReq, TRes>(handler: AsyncHandler<TReq, TRes>) =>
  (req: TReq, res: TRes, next: NextFn) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
