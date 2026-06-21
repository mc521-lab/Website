import type { APIRoute } from "astro";
export const GET: APIRoute = ({ params }) => new Response("id=" + params.id);
