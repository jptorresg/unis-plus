import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ProfileScreen } from '../screens/profile/ProfileScreen'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppStackParamList = {
  Profile: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}
