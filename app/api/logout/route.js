export async function GET() {
  const response = new Response(JSON.stringify({ success: true }), { status: 200 });
  response.headers.set("Set-Cookie", `token=; HttpOnly; Path=/; Max-Age=0;`);
  return response;
}
