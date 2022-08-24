import { createRouter } from '../../createContext'
import { LoginInput, SignUpInput } from './auth.schema'
import { AuthService } from './auth.service'

const authService = new AuthService()

//* Auth Router
export const authRouter = createRouter()
  //* SignUp
  .mutation('signup', {
    input: SignUpInput,
    resolve: async ({ input, ctx }) => await authService.signup({ input, ctx }),
  })

  //* Login
  .mutation('login', {
    input: LoginInput,
    resolve: async ({ input, ctx }) => await authService.login({ input, ctx }),
  })

  //* Refresh
  .mutation('refresh', {
    resolve: async ({ ctx }) => await authService.refresh({ ctx }),
  })

  //* Logout
  .mutation('logout', {
    resolve: async ({ ctx }) => await authService.logout({ ctx }),
  })
