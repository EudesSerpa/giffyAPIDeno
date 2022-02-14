import { Context } from "../deps.ts";

export const authorized = async (
  { response, state }: Context,
  next: () => void
) => {
  if (state.currentUser) {
    await next();
  } else {
    response.status = 401;
    response.body = {
      error: "Unauthorized",
    };
  }
};
