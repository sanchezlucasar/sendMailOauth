import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/libs/db';
import bcrypt from 'bcrypt';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "*****" },
            },
            async authorize(credentials: { email: string; password: string } | undefined, req: any) {
                try {

                    if (!credentials || !credentials.email || !credentials.password) return null

                    const userFound = await db.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })


                    if (!userFound) return null;

                    const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

                    if (!matchPassword) return null;

                    return {

                        id: String(userFound.id),
                        name: userFound.username,
                        email: userFound.email,
                    }

                } catch (error) {
                    console.error("Error durante la autenticación:", error);
                    return null;
                }


            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
