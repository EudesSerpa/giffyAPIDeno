/**
 * Get JWT from request Header
 */

import { Context, verify } from "../deps.ts";

import { User, users } from "../user.ts";
import { exportKeyJWT, importPrivateKey } from "../key.ts";

export const userMiddleware = async (ctx: Context, next: Function) => {
  try {
    const authorization = ctx.request.headers.get("authorization");
    let jwt = "";

    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      jwt = authorization.substring(7);
    }

    if (jwt) {
      const key = await importPrivateKey(exportKeyJWT);

      const payload = await verify(jwt, key);

      if (payload) {
        const user: any = users.find((u: User) => u.username === payload.iss);
        ctx.state.currentUser = user;

        await next();
      } else {
        ctx.state.currentUser = null;
        ctx.cookies.delete("jwt");
        await next();
      }
    } else {
      ctx.state.currentUser = null;
      await next();
    }
  } catch (error) {
    console.log(error.message);
    ctx.throw(401, "Unauthorized");
  }
};
