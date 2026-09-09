import { createServer } from "node:http";
import next from "next";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const hostname = "0.0.0.0";
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

createServer((request, response) => handle(request, response)).listen(port, hostname, () => {
  console.info(`Ramprate server ready on port ${port}`);
});
