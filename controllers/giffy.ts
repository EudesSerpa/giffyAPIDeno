import type { RouterContext } from "../deps.ts";

import { users, User } from "../user.ts";
import { favs } from '../favs.ts';
import { exportKeyJWT, importPrivateKey } from "../key.ts";

import { 
    create,
    getNumericDate
} from "https://deno.land/x/djwt@v2.4/mod.ts";


export const getFavs = async (ctx: RouterContext<"/favs">) => {
    const { username } = ctx.state.currentUser;
    
    ctx.response.status = 200
    ctx.response.body = { favs: favs[username] }
}

export const deleteFav = async (ctx: RouterContext<"/favs/:id">) => {
    const { id } = ctx.params;
    const { username } = ctx.state.currentUser;

    favs[username] = favs[username].filter(
        (favId : String) => favId !== id
    )

    ctx.response.body = { favs: favs[username] }
    ctx.response.status = 200
}

export const postFav = async (ctx: RouterContext<"/favs/:id">) => {
    const { id } = ctx.params;
    const { username } = ctx.state.currentUser;

    const alreadyExist = favs[username].some(
        (favId : string) => favId === id
    )

    if (!alreadyExist) {
        favs[username].push(id)
    }

    ctx.response.body = { favs: favs[username] }
    ctx.response.status = 201;
}

export const postLogin = async (ctx: RouterContext<"/login">) => {
    if(!ctx.request.hasBody) {
        ctx.throw(400, "Bad Request: body is missing");
    }

    const {username, password} = await ctx.request.body().value;

    if(!username || !password) {
        ctx.throw(400, "Bad Request: username/passworod is missing");
    }

    const user: any = users.find((u: User) => u.username === username);

    if (!user) {
        ctx.response.status = 403;
    } else if (password !== user.password) {
        ctx.response.status = 403;
    } else {
        const payload =  {
            iss: username,
            exp: getNumericDate(Date.now() * 60 * 60 * 30)
        };

        const key = await importPrivateKey(exportKeyJWT);

        const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);

        ctx.response.status = 200;
        ctx.response.body = {jwt};
    }
}

export const postRegister = async (ctx: RouterContext<"/register">) => {
    const {username, password} = await ctx.request.body().value;

    const user: User = {
        username,
        password
    };

    // Check existence of the user
    const alreadyExist = users.find((user: { username: any; }) => user.username === username)
    
    if (alreadyExist) {
        ctx.response.status = 409
    } else {
        // Added new user
        users.push(user);
        
        // initialize the user favs
        favs[username] = [];
        ctx.response.status = 201
    }
}