import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="call" 
          options={{
            presentation: 'modal',
            headerShown: false
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}

