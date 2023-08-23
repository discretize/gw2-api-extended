import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "fs";

function readFile(path: string, file: string) {
  const data = JSON.parse(
    fs.readFileSync(path + file, { encoding: "utf8", flag: "r" })
  );

  return data;
}

const app = new Hono();
app.use("/v2/*", cors());

const handleEndpoint = (namespace: any) => async (c: any) => {
  const data = c.req
    .query("ids")
    .split(",")
    .map((id: string) => parseInt(id))
    .map((id: number) => namespace.find((datum: any) => datum.id === id))
    .filter((datum: any) => datum);

  if (data.length === 0) {
    c.status(404);
    return c.json({ text: "all ids provided are invalid" });
  }
  return c.json(data);
};

app.get(
  "/v2/skills",
  handleEndpoint(readFile("./data/api-extended/", "skills.json"))
);
app.get(
  "/v2/traits",
  handleEndpoint(readFile("./data/api-extended/", "traits.json"))
);
app.get(
  "/v2/items",
  handleEndpoint(readFile("./data/api-extended/", "items.json"))
);
app.get(
  "/v2/specializations",
  handleEndpoint(readFile("./data/api-extended/", "specializations.json"))
);

serve({ fetch: app.fetch, port: 3333 }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
