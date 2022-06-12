import { useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Location } from '../interfaces/app-interfaces';

export const useLocation = () => {

    //state para saber si tengo o no una coordenada del usuario
    //(no quiero mostrar el mapa hasta no saber la ubicación del usuario)
    const [hasLocation, setHasLocation] = useState(false);
    
    //state para guardar la ubicación del usuario
    const [initialPosition, setinitialPosition] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    //state para hacer el seguimiento del usuario a medida que se va moviendo
    const [userLocation, setUserLocation] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    //para trazar una linea a medida que el usuario se va moviendo
    const [routeLines, setRouteLines] = useState<Location[]>([]);

    //useRef es como el useState pero para referencias. No voy a hacer una re-renderizacion
    //cada vez que cambie el valor. Es simplemente para guardar una variable.
    const watchId = useRef<number>();

    //para saber cuando el componente esta montado
    const isMounted = useRef<boolean>(true);

    useEffect(() => {
        isMounted.current = true;

        //cuando se llame este return, significa que el componente ya fue desmontado
        return () => {
            isMounted.current = false;
        }
    }, [])
    


    //con esto obtengo la localización del usuario
    useEffect(() => { 

        //esta funcion devuelve una promesa
        getCurrentLocation()
            .then( location => {

                if (!isMounted.current) return;

                setinitialPosition(location);
                setUserLocation(location);
                setRouteLines([...routeLines, location]);
                setHasLocation(true);
            })
            .catch(err => {
                console.log(err);
            });

    }, []);


    //getCurrentLocation es una funcion que retorna una promesa, y la promesa resuelve
    //algo de tipo Location. Que es location? Un objeto que contiene la latitud y longitud
    const getCurrentLocation = (): Promise<Location> => {
        return new Promise((resolve, reject) => {

            Geolocation.getCurrentPosition(   
                //este es el caso de success     
                (info) => {
                    resolve({
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude
                    });
                }, 
                //este es el caso de error
                (error) => reject({error}),  
                //estas son las options
                {
                    enableHighAccuracy: true, 
                }
            );

        });
    }

    //para que la pantalla siga al usuario cuando esta en movimiento
    const followUserLocation = () => {
        watchId.current = Geolocation.watchPosition(
             //este es el caso de success     
             (info) => {

                if (!isMounted.current) return;

                const location: Location = {
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                }

                setUserLocation(location);

                setRouteLines( routes => [...routes, location]);
            }, 
            //este es el caso de error
            (error) => console.log(error),  
            //estas son las options
            {
                enableHighAccuracy: true, 
                distanceFilter: 1,//con esto le digo "notificame cada vez que pase 1 metros"
            }
        );
    }

    //para dejar de seguir al usuario a medida que se va moviendo
    const stopFollowUserLocation = () => {
        if (watchId.current) {
            Geolocation.clearWatch(watchId.current);
        }
    }


    //retorno los states
    return{
        hasLocation,
        initialPosition,
        getCurrentLocation,
        followUserLocation,
        userLocation,
        stopFollowUserLocation,
        routeLines
    }
}
