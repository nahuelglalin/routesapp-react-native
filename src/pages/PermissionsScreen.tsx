import React, { useContext } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { check, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions';
import BlackButton from '../components/BlackButton';
import { PermissionsContext } from '../context/PermissionsContext';

export const PermissionsScreen = () => {

  const {permissions, askLocationPermission} = useContext(PermissionsContext);

  return (
    <View style={styles.container}>
      <Text>Es necesario habilitar el GPS para el uso de esta aplicación</Text>


      <BlackButton 
       title="Conocer el estado de los permisos"
       onPress={askLocationPermission}
      />

      <Text> 
        { JSON.stringify(permissions, null, 5) }
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
