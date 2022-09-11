import { Application, parse, oakCors, CorsOptions } from "./deps.ts";
import { green, yellow } from "./dev_deps.ts";
import giffyRouter from "./routes/giffy.ts";
import { userAuthentication } from "./middlewares/userAuthentication.ts";
import notFound from "./middlewares/notFound.ts";

const app = new Application();

const DEFAULT_PORT = 8080;
const portFromArgs = parse(Deno.args).port;
const port = portFromArgs ?? DEFAULT_PORT;

const whitelist = [
  "http://localhost:3000",
  "https://giffys-search.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (requestOrigin) => {
    const origins = whitelist;
    console.log("requestOrigin", requestOrigin);

    return origins; //  Reflect (enable) the requested origin in the CORS response for this origins
  },
};

app.use(oakCors(corsOptions));
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
