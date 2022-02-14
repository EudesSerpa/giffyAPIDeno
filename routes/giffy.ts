import { Router } from "../deps.ts";
import { authorized } from "../middlewares/authorized.ts";
import {
  getFavs,
  deleteFav,
  postFav,
  Register,
  Login,
} from "../controllers/giffy-controllers.ts";

const router = new Router();

router
  .get("/favs", authorized, getFavs)
  .delete("/favs/:id", authorized, deleteFav)
  .post("/favs/:id", authorized, postFav)
  .post("/login", Login)
  .post("/register", Register);

export default router;
