import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import { JWT } from "next-auth/jwt"

interface AuthResponse {
  data: {
    jwt: string
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null
        }

        try {
          const res = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
            {
              email: credentials.identifier,
              password: credentials.password,
            }
          )

          const { jwt, user } = res.data.data

          if (user) {
            return {
              jwt,
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }
          return null
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            throw new Error(error.response.data.error.message)
          }
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role

        token.jwt = (user as any).jwt
      }
      return token
    },
    session: async ({ session, token }: { session: any; token: JWT }) => {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      }
      session.jwt = token.jwt
      return session
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  debug: true,
})

export { handler as GET, handler as POST }
