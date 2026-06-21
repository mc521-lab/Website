import type { APIRoute } from "astro";
export const prerender = false;
export const GET: APIRoute = ({ params }) => new Response("id=" + params.id);
