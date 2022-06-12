//Este context va a estar al pendiente de los cambios en el estado de los permisos
import React, { createContext, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { check, PERMISSIONS, PermissionStatus, request, openSettings } from "react-native-permissions";

//1. interfaz que va a tener el estado de los permisos
export interface PermissionsState {
    locationStatus: PermissionStatus;
}

//2. este es mi initial state
export const permissionInitialState: PermissionsState = {
    locationStatus: 'unavailable'
}

//3. lo que el context expone (es lo mismo que sea un type o una interface)
type PermissionContextProps = {
    permissions: PermissionsState;
    askLocationPermission: () => void;
    checkLocationPermission: () => void;
}

//4. creo el context
export const PermissionsContext = createContext({} as PermissionContextProps);

//5. creo el provider
export const PermissionsProvider = ({ children }: any) => {

    //inicio el state con el valor permissionInitialState
    const [permissions, setPermissions] = useState(permissionInitialState);

    //lee el estado de la app, si esta en 2do plano, si se minimiza, etc
    //esto es para que, si se le cambian los permisos a la app desde afuera, es decir
    //le saco un permiso a la app desde las settings, la app se actualice y 
    //muestre la info correcta
    useEffect(() => {

        //para prevenir un "loading" infinito
        checkLocationPermission();

        AppState.addEventListener('change', (state) => {
            if (state != 'active') {
                return;
            } else {
                checkLocationPermission();
            }
        });
    }, [])
    
    //funcion para chequear si tengo permisos para acceder a la 
    //localizacion con gps 
    const askLocationPermission = async () => {
        //variable que guardará el status de los permisos 
        //es decir, si tengo persmisos para usar el gps o no
        let permissionStatus: PermissionStatus;

        if (Platform.OS === 'ios') {
            permissionStatus = await request( PERMISSIONS.IOS.LOCATION_WHEN_IN_USE );
        } else {
            permissionStatus = await request( PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION );
        }

        //si el permiso fue bloqueado
        if (permissionStatus === 'blocked'){
            openSettings();
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus 
        });
    }

    //se dispara cuando la persona regresa a nuestra app
    const checkLocationPermission = async () => {
        let permissionStatus: PermissionStatus;

        if (Platform.OS === 'ios') {
            permissionStatus = await check( PERMISSIONS.IOS.LOCATION_WHEN_IN_USE );
        } else {
            permissionStatus = await check( PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION );
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus 
        });
    }

    return (
        <PermissionsContext.Provider
            value={{
                permissions: permissions,
                askLocationPermission: askLocationPermission,
                checkLocationPermission: checkLocationPermission
            }}
        >
            {children}
        </PermissionsContext.Provider>
    )
}