
export const calculateAndDisplayRoute = async (
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  start: string,
  end: string,  
) => {    
  return directionsService
    .route({
      origin: {
        query: start.toString(),
      },
      destination: {
        query: end.toString(),
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response: any) => {      
      directionsRenderer.setDirections(response);      
      return response.routes[0].legs[0].distance;
    })
    .catch((e: any) => {
      directionsRenderer.setMap(null);
      return e.message;
    });
};
