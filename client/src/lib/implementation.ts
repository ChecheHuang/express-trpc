/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

type PostApiAuthLoginInput = {
  account: string;
  password: string;
};

type PostApiAuthLoginResponse =
  | {
      status: "success";
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type PostApiAuthRefreshInput = {
  refreshToken: string;
};

type PostApiAuthRefreshResponse =
  | {
      status: "success";
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type GetApiTodoInput = {};

type GetApiTodoResponse =
  | {
      status: "success";
      data: {
        name: string;
      };
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type PostApiTodoInput = {};

type PostApiTodoResponse =
  | {
      status: "success";
      data: {};
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type GetApiTodoIdInput = {
  id: string;
};

type GetApiTodoIdResponse =
  | {
      status: "success";
      data: {};
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type PutApiTodoIdInput = {
  id: string;
};

type PutApiTodoIdResponse =
  | {
      status: "success";
      data: {};
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type DeleteApiTodoIdInput = {} & {};

type DeleteApiTodoIdResponse =
  | {
      status: "success";
      data: {};
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

export type Path =
  | "/api/auth/login"
  | "/api/auth/refresh"
  | "/api/todo"
  | "/api/todo"
  | "/api/todo/:id"
  | "/api/todo/:id"
  | "/api/todo/:id";

export type Method = "get" | "post" | "put" | "delete" | "patch";

export type MethodPath = `${Method} ${Path}`;

export interface Input extends Record<MethodPath, any> {
  "post /api/auth/login": PostApiAuthLoginInput;
  "post /api/auth/refresh": PostApiAuthRefreshInput;
  "get /api/todo": GetApiTodoInput;
  "post /api/todo": PostApiTodoInput;
  "get /api/todo/:id": GetApiTodoIdInput;
  "put /api/todo/:id": PutApiTodoIdInput;
  "delete /api/todo/:id": DeleteApiTodoIdInput;
}

export interface Response extends Record<MethodPath, any> {
  "post /api/auth/login": PostApiAuthLoginResponse;
  "post /api/auth/refresh": PostApiAuthRefreshResponse;
  "get /api/todo": GetApiTodoResponse;
  "post /api/todo": PostApiTodoResponse;
  "get /api/todo/:id": GetApiTodoIdResponse;
  "put /api/todo/:id": PutApiTodoIdResponse;
  "delete /api/todo/:id": DeleteApiTodoIdResponse;
}

export const jsonEndpoints = {
  "post /api/auth/login": true,
  "post /api/auth/refresh": true,
  "get /api/todo": true,
  "post /api/todo": true,
  "get /api/todo/:id": true,
  "put /api/todo/:id": true,
  "delete /api/todo/:id": true,
};

export const endpointTags = {
  "post /api/auth/login": ["\u8EAB\u5206\u9A57\u8B49"],
  "post /api/auth/refresh": ["\u8EAB\u5206\u9A57\u8B49"],
  "get /api/todo": ["Todo"],
  "post /api/todo": ["Todo"],
  "get /api/todo/:id": ["Todo"],
  "put /api/todo/:id": ["Todo"],
  "delete /api/todo/:id": ["Todo"],
};

export type Provider = <M extends Method, P extends Path>(
  method: M,
  path: P,
  params: Input[`${M} ${P}`],
) => Promise<Response[`${M} ${P}`]>;

export type Implementation = (
  method: Method,
  path: string,
  params: Record<string, any>,
) => Promise<any>;

export class ExpressZodAPIClient {
  constructor(protected readonly implementation: Implementation) {}
  public readonly provide: Provider = async (method, path, params) =>
    this.implementation(
      method,
      Object.keys(params).reduce(
        (acc, key) => acc.replace(`:${key}`, params[key]),
        path,
      ),
      Object.keys(params).reduce(
        (acc, key) =>
          path.indexOf(`:${key}`) >= 0 ? acc : { ...acc, [key]: params[key] },
        {},
      ),
    );
}

// Usage example:

export const implementation: Implementation = async (
  method,
  path,
  params,
) => {
  const hasBody = !["get", "delete"].includes(method);
  const searchParams = hasBody ? "" : `?${new URLSearchParams(params)}`;
  const response = await fetch(`http://192.168.68.109:8080${path}${searchParams}`, {
    method: method.toUpperCase(),
    headers: hasBody ? { "Content-Type": "application/json" } : undefined,
    body: hasBody ? JSON.stringify(params) : undefined,
  });
  if (`${method} ${path}` in jsonEndpoints) {
    return response.json();
  }
  return response.text();
};



export const provide = new ExpressZodAPIClient(implementation).provide