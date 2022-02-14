import type { RouterContext } from "../deps.ts";
import { bcrypt, create, Collection, getNumericDate } from "../deps.ts";
import { exportKeyJWT, importPrivateKey } from "../key.ts";
import { UserSchema } from "../schema/user.ts";
import { FavSchema } from "../schema/fav.ts";
import { db } from "../database/connection.ts";
import { findUserFavs } from "../querys/findUserFavs.ts";
import { deleteUserFav } from "../querys/deleteUserFav.ts";

const users: Collection<UserSchema> = db.collection<UserSchema>("users");
const favs: Collection<FavSchema> = db.collection<FavSchema>("favs");

export const getFavs = async ({ response, state }: RouterContext<"/favs">) => {
  const { _id: userId } = state.currentUser;

  const userFavs = await findUserFavs({ userId, collection: users });

  response.status = 200;
  response.body = {
    data: userFavs,
  };
};

export const deleteFav = async ({
  response,
  params,
  state,
}: RouterContext<"/favs/:id">) => {
  const { id: favId } = params;
  const { _id: userId } = state.currentUser;

  const ok = await deleteUserFav({
    userId,
    favId,
    collection: users,
    collectionFromDelete: favs,
  });

  if (!ok) {
    response.status = 406;
    response.body = {
      error: "Don't allowed",
    };
    return;
  }

  const userFavs = await findUserFavs({ userId, collection: users });

  response.status = 200;
  response.body = {
    data: userFavs,
  };
};

export const postFav = async ({
  response,
  params,
  state,
}: RouterContext<"/favs/:id">) => {
  const { id: favId } = params;
  const { _id: userId } = state.currentUser;

  const userFavs = await findUserFavs({ userId, collection: users });

  const alreadyExist = userFavs?.some((fav: any) => fav.favId === favId);

  if (alreadyExist) {
    response.status = 409;
    response.body = {
      error: "Fav already exists",
    };
    return;
  }

  await favs.insertOne({
    favId,
    userId,
  });

  const newUserFavs = await findUserFavs({ userId, collection: users });

  response.status = 201;
  response.body = {
    data: newUserFavs,
  };
};

export const Register = async ({
  request,
  response,
}: RouterContext<"/register">) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        error: "The body is missing",
      };

      return;
    }

    const { username, password } = await request.body().value;

    if (!username || !password) {
      response.status = 400;
      response.body = {
        error: "Username/Passworod is missing",
      };

      return;
    }

    // Check existence of the user
    const alreadyExist = await users.findOne({ username });

    if (alreadyExist) {
      response.status = 409;
      response.body = {
        error: "User already exists",
      };

      return;
    }

    // Create user
    const _id = await users.insertOne({
      username,
      password: await bcrypt.hash(password),
    });

    response.status = 201;
    response.body = {
      message: "User created successfully",
    };
  } catch (error) {
    console.log(error.message);

    response.status = 400;
    response.body = {
      error: error.message,
    };
  }
};

export const Login = async ({ request, response }: RouterContext<"/login">) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        error: "The body is missing",
      };

      return;
    }

    const { username, password } = await request.body().value;

    if (!username || !password) {
      response.status = 400;
      response.body = {
        error: "Username/Passworod is missing",
      };
    }

    // Get user
    const user = await users.findOne({ username });

    if (!user) {
      response.status = 403;
      response.body = {
        error: "User not found",
      };

      return;
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      response.status = 403;
      response.body = {
        error: "Invalid credentials",
      };

      return;
    }

    const payload: any = {
      iss: user._id,
      exp: getNumericDate(Date.now() * 60 * 60 * 30),
    };

    const key = await importPrivateKey(exportKeyJWT);

    const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);

    response.status = 200;
    response.body = {
      message: "Successful user loging",
      data: jwt,
    };
  } catch (error) {
    console.log(error.message);

    response.status = 400;
    response.body = {
      error: error.message,
    };
  }
};
