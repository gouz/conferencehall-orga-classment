import html from "./render/index.html.txt";
import js from "./render/main.js.txt";
import css from "./render/main.css.txt";
import type { Options } from "./types";

export const render = (json: JSON, options?: Options) => {
  const server = Bun.serve({
    port: 1337,
    async fetch(req) {
      const path = new URL(req.url).pathname;
      if (path === "/main.css")
        return new Response(css, {
          headers: { "content-type": "text/css" },
        });
      if (path === "/main.js")
        return new Response(
          `
          const exportJSON = ${JSON.stringify(json).replaceAll("\n", "<br>")}
          const options = ${JSON.stringify(options)};
          ${js}
          `.trim(),
          {
            headers: {
              "Content-Type": "application/javascript",
            },
            status: 200,
          }
        );
      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
        status: 200,
      });
    },
  });

  console.log("🍫 is listening on \x1b[1m\x1b[35;49m%s\x1b[0m", server.url);
};

export default render;
