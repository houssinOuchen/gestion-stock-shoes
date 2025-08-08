import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import Cookies from "js-cookie";
import { cookies } from "next/headers"; // Add this if needed
import { serialize } from "cookie";


export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user) {
    return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Mot de passe incorrect" }), { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.acces },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const cookie = serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  const response = new Response(JSON.stringify({ success: true, token }), {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });

  // Set token in cookie
  //response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
  response.headers.append("Set-Cookie", cookie);


  return response;
}
