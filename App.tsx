import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { PermissionsProvider } from './src/context/PermissionsContext';

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  )
}

//para envolver mi app en el context de permisos
const AppState = ({children}: any) => {
  return (
    <PermissionsProvider>
      {children}
    </PermissionsProvider>
  )
}

export default App;


// AIzaSyD0PYcb7nJ0uJb0TQ0HdXSrgxcPAB5O3Q0