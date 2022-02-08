import { Router } from "../deps.ts";
import { authorized } from "../middlewares/authorized.ts";
import {
  getFavs,
  deleteFav,
  postFav,
  RegisterUserDB,
  LoginUserDB,
  LogoutUserDB,
} from "../controllers/giffy-controllers.ts";

const router = new Router();

router
  .get("/favs", authorized, getFavs)
  .delete("/favs/:id", authorized, deleteFav)
  .post("/favs/:id", authorized, postFav)
  .post("/login", LoginUserDB)
  .post("/logout", LogoutUserDB)
  .post("/register", RegisterUserDB);

export default router;
