// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "@/lib/dbConnect";
// import bcrypt from "bcryptjs";
// import UserModel from "@/model/User";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await dbConnect();
//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { username: credentials.identifier },
//               { email: credentials.identifier },
//             ],
//           });
//           if (!user) {
//             throw new Error("No user found");
//           }
//           if (!user.isVerified) {
//             throw new Error("User not verified");
//           }
//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
//           if (isPasswordCorrect) {
//             return user;
//           } else {
//             throw new Error("Invalid credentials");
//           }
//         } catch (error: any) {
//           throw new Error(`${error.message} - Invalid credentials`);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user._id?.toString();
//         token.isVerified = user.isVerified;
//         token.username = user.username;
//         token.role = user.role;
//         token.rollno = user.rollno;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token.id;
//         session.user.isVerified = token.isVerified;
//         session.user.username = token.username;
//         session.user.role = token.role;
//         session.user.rollno = token.rollno;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/signin",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { User } from "@/model/User"; // Assuming you have a User type defined

// Define the credentials type
interface Credentials {
  identifier: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        if (!credentials) {
          return null;
        }

        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found");
          }

          if (!user.isVerified) {
            throw new Error("User not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          // Type the error as an Error object
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`${errorMessage} - Invalid credentials`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User)._id?.toString();
        token.isVerified = (user as User).isVerified;
        token.username = (user as User).username;
        token.role = (user as User).role;
        token.rollno = (user as User).rollno;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.rollno = token.rollno;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};