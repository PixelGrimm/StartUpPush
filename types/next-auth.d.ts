import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isProfileComplete: boolean
      points: number
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    isProfileComplete: boolean
    points: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isProfileComplete: boolean
    points: number
  }
}
