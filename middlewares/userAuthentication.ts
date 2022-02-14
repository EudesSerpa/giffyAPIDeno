/**
 * Get JWT from request Header
 */

import { Context, verify, Bson } from "../deps.ts";
import { exportKeyJWT, importPrivateKey } from "../key.ts";
import { UserSchema } from "../schema/user.ts";
import { db } from "../database/connection.ts";

const users = db.collection<UserSchema>("users");

export const userAuthentication = async (
  { request, response, state }: Context,
  next: () => void
) => {
  try {
    let jwt = "";
    const authorization = request.headers.get("authorization");
    const isBearerToken = authorization?.toLowerCase().startsWith("bearer");

    if (authorization && isBearerToken) {
      jwt = authorization.substring(7);
    }

    if (!jwt) {
      state.currentUser = null;
      await next();
      return;
    }

    const key = await importPrivateKey(exportKeyJWT);

    const payload = await verify(jwt, key);

    if (!payload) {
      state.currentUser = null;
      await next();
      return;
    }

    const user = await users.findOne({ _id: new Bson.ObjectId(payload.iss) });

    if (!user) {
      state.currentUser = null;
      await next();
      return;
    }

    state.currentUser = user;
    await next();
  } catch (error) {
    response.status = 401;
    response.body = {
      error: error.message,
    };
  }
};
