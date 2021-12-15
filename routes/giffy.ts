import { Router } from "../deps.ts";

import {
    getFavs,
    deleteFav,
    postFav,
    postLogin,
    postRegister,
} from "../controllers/giffy.ts";

import { authorized } from "../middlewares/authorized.ts";


const router = new Router();

router
    .get("/favs", authorized, getFavs)
    .delete("/favs/:id", authorized, deleteFav)
    .post("/favs/:id", authorized, postFav)
    .post("/login", postLogin)
    .post("/register", postRegister)

export default router;