// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export const calculateAndDisplayRoute = (
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  start: string,
  end: string
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
      return JSON.stringify(response.routes);
    })
    .catch((e: any) => {
      window.alert(`Directions request failed due to ${e}`);
      return e;
    });
};
