import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth"; // Tipo User de NextAuth

// Define un tipo de usuario personalizado que extienda el User de NextAuth
interface CustomUser extends User {
    tokenJWT: string;
    userdata: {};
}

// Opciones de NextAuth con tipado correcto
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await authenticateUser(credentials.username, credentials.password);

                if (user) {
                    return user as CustomUser; // Devolver el usuario tipado como CustomUser
                } else {
                    return null; // Retorna null si la autenticación falla
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser;
                token.name = customUser.name;
                token.email = customUser.email;
                token.tokenJWT = customUser.tokenJWT;
                token.userdata = customUser.userdata;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                (session.user as CustomUser).tokenJWT = token.tokenJWT as string;
                (session.user as CustomUser).userdata = token.userdata as {};
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login"
    }
} as NextAuthOptions);

export { handler as GET, handler as POST };

// Función de autenticación de usuarios
async function authenticateUser(username: string, password: string) {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
        return { 
            email: username,
            tokenJWT: data.access_token, 
            userdata: data.user
        } as CustomUser;
    }

    return null;
}
