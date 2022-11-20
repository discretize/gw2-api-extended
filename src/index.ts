import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { Schema } from "hono/dist/validator/schema";

export interface Env {
  discretize_skills: KVNamespace;
  discretize_traits: KVNamespace;
  discretize_items: KVNamespace;
  discretize_specializations: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();
app.use("/v2/*", cors());

const handleEndpoint =
  (namespace: KVNamespace) =>
  async (
    c: Context<
      string,
      {
        Bindings: Env;
      },
      Schema
    >
  ) => {
    const promises = await Promise.all(
      c.req
        .query("ids")
        .split(",")
        .map(async (id: string) => await namespace.get(id))
    );

    const data = promises
      .map((datum) => datum && JSON.parse(datum))
      .filter((datum) => datum);

    if (data.length === 0) {
      c.status(404);
      return c.json({ text: "all ids provided are invalid" });
    }
    return c.json(data);
  };

app.get("/v2/skills", (c) => handleEndpoint(c.env.discretize_skills)(c));
app.get("/v2/traits", (c) => handleEndpoint(c.env.discretize_traits)(c));
app.get("/v2/items", (c) => handleEndpoint(c.env.discretize_items)(c));
app.get("/v2/specializations", (c) =>
  handleEndpoint(c.env.discretize_specializations)(c)
);

export default app;
