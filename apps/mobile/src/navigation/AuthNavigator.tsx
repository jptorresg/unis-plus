import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { LoginScreen } from '../screens/auth/LoginScreen'
import { RegisterScreen } from '../screens/auth/RegisterScreen'
import { VerifyEmailScreen } from '../screens/auth/VerifyEmailScreen'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  VerifyEmail: { email: string }
  ForgotPassword: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  )
}
