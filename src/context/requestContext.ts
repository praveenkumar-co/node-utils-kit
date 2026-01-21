import { AsyncLocalStorage} from "async_hooks" ;

export interface RequestContext {
    requestId?: string;
    userId?: string;
    traceId?: string;
    extras?: Record<string, unknown>;    
}
const storage = new AsyncLocalStorage();

export function withContext<T>(
  context: RequestContext, 
  fn: () => T
): T {
  return storage.run(context, fn);
}

export function getContext(): RequestContext {
  return storage.getStore() ?? {};
}

export function setContext(values: Partial<RequestContext>) {
  const store = storage.getStore();
  if (store) {
    Object.assign(store, values);
  }
} 

