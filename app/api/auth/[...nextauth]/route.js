// import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { connectDB } from "@/lib/mongodb"
// import User from "@/models/User"
// import bcrypt from "bcrypt"

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB()

//         const user = await User.findOne({ email: credentials.email })
//         if (!user) throw new Error("Utilisateur non trouvé")

//         const isValid = await bcrypt.compare(credentials.password, user.password)
//         if (!isValid) throw new Error("Mot de passe incorrect")

//         return {
//           id: user._id.toString(),
//           name: user.username,
//           email: user.email,
//           role: user.acces,
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub
//       session.user.role = token.role
//       return session
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role
//       }
//       return token
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// })

// export { handler as GET, handler as POST }
