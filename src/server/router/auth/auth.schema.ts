import { UserInput } from '../self/self.schema'
import { TypeOf } from 'zod'

export const LoginInput = UserInput.pick({ email: true, password: true })

export type TLoginInput = TypeOf<typeof LoginInput>

export const SignUpInput = UserInput

export type TSignUpInput = TypeOf<typeof SignUpInput>

export type TAuthWithToken = {
  email?: string | null
  name?: string | null
}
