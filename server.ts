import { Application, oakCors, parse } from "./deps.ts";
import { green, yellow } from "./dev_deps.ts";
import giffyRouter from "./routes/giffy.ts";
import { userAuthentication } from "./middlewares/userAuthentication.ts";
import notFound from "./middlewares/notFound.ts";

const app = new Application();

const DEFAULT_PORT = 8080;
const portFromArgs = parse(Deno.args).port;
const port = portFromArgs ?? DEFAULT_PORT;

app.use(oakCors()); // Enable CORS for All Routes
app.use(userAuthentication);
app.use(giffyRouter.routes());
app.use(giffyRouter.allowedMethods());
app.use(notFound);

app.addEventListener("error", (evt: { error: any }) => {
  console.log(evt.error);
});

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;

  console.log(`${yellow("Listening on:")} ${green(url)}`);
});

await app.listen({ port });
