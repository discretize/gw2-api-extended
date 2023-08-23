import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import skills from "../data/api-extended/skills.json";
import traits from "../data/api-extended/traits.json";
import items from "../data/api-extended/items.json";
import specializations from "../data/api-extended/specializations.json";

const app = new Hono();
app.use("/v2/*", cors());

const handleEndpoint = (namespace: any) => async (c: any) => {
  const data = c.req
    .query("ids")
    .split(",")
    .map((id: string) => parseInt(id))
    .map((id: number) => namespace.find((datum: any) => datum.id === id));

  console.log(data);

  if (data.length === 0) {
    c.status(404);
    return c.json({ text: "all ids provided are invalid" });
  }
  return c.json(data);
};

app.get("/v2/skills", handleEndpoint(skills));
app.get("/v2/traits", handleEndpoint(traits));
app.get("/v2/items", handleEndpoint(items));
app.get("/v2/specializations", handleEndpoint(specializations));

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
});
