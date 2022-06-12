import React, { useRef, useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


//interface para recibir markers
interface Props {
    markers?: Marker[]
}

//functional component que renderiza un mapa
export const Map = ({ markers }: Props) => {

    //llamo a mi hook personalizado
    const { hasLocation,
        initialPosition,
        getCurrentLocation,
        followUserLocation,
        userLocation,
        stopFollowUserLocation,
        routeLines
    } = useLocation();

    //para mostrar y ocultar la polyline
    const [showPolyline, setShowPolyline] = useState<boolean>(false);

    useEffect(() => {
        followUserLocation();

        //para cancelar el seguimiento cdo se destruye el componente. 
        //Recordemos que este return se ejecuta cuando se destruye el componente
        return () => {
            stopFollowUserLocation();
        }
    }, [])

    useEffect(() => {

        if (!following.current) {
            return;
        }

        mapViewRef.current?.animateCamera({
            center: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
            },
            zoom: 15
        });


    }, [userLocation])


    //es un useRef porque yo no voy a actualizar esto mediante algun dispatch o algo asi
    //sino que solo necesito mantener una referencia
    const mapViewRef = useRef<MapView>();

    //variable flag para saber si estoy siguiendo al usuario o no
    const following = useRef<boolean>(true);

    //funcion para centrar el screen en donde se encuentra el usuario x geolocalizacion
    const centerPosition = async () => {

        const location = await getCurrentLocation();//llamo al getCurrentLocation del hook useLocation

        following.current = true;

        //animo la camara para que, al tocar el boton, se mueva con una animacion hasta donde esta la posicion del usuario
        mapViewRef.current?.animateCamera({
            center: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            zoom: 15
        });
    }   



    //si no tengo ubicación del usuario, muestro el loading
    if (!hasLocation) {
        return <LoadingScreen />
    }

    return (
        <>
            <MapView
                ref={(elemento) => mapViewRef.current = elemento!}
                style={{ flex: 1 }}
                showsUserLocation={true}
                initialRegion={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onTouchStart={() => { following.current = false }}
            >
                {
                    showPolyline &&
                    <Polyline
                        coordinates={routeLines}
                        strokeWidth={3}
                        strokeColor="#1f76e0"
                    />
                }
            </MapView>
            <Fab
                iconName="compass-outline"
                onPress={centerPosition}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }}
            />
            <Fab
                iconName="brush-outline"
                onPress={() => setShowPolyline(!showPolyline)}
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20
                }}
            />
        </>
    )
}
