// Packages
import { Identifier } from 'ra-core'

export interface User {
  id: Identifier
  name: string
  birthdate: string
  email: string
  password: string
  created_at: string
  updated_at: string
}
