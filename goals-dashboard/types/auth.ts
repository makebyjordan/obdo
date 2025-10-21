export interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: User
  expires: string
}
