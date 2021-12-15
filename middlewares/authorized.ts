import { Context } from "../deps.ts";

export const authorized = async (ctx: Context, next: Function) => {
    if (ctx.state.currentUser) {
        await next();
    } else {
        ctx.response.status = 405;
    }
}