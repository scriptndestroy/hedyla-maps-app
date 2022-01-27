import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAlert, setOpen } from "../alert/alertSlice";
import { callDirectionsAPI, selectMap } from "./mapSlice";
import { useDeepCompareEffectForMaps } from "./utils";

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  callApi: any;
}
var directionsRenderer: any;
var directionsService: any;

const Map: React.FC<MapProps> = ({
  onIdle,
  children,
  style,
  callApi,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  const mapsSelector = useAppSelector(selectMap);
  const alertSelector = useAppSelector(selectAlert);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
      directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsService = new window.google.maps.DirectionsService();
    }
  }, [ref, map]);

  useEffect(() => {
    callApi.current = handleCall;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callApi, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
      directionsRenderer.setMap(map);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      // if (onClick) {
      //   map.addListener("click", onClick);
      // }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onIdle]);

  const handleCall = (start: any, end: any) => {
    dispatch(
      callDirectionsAPI({
        directionsService,
        directionsRenderer,
        start,
        end,
        map,
      })
    ).then((res) => {
      directionsRenderer.setMap(map);
    });
  };

  useEffect(() => {
    if (mapsSelector.distance !== 0 && alertSelector.open) {
      dispatch(
        setOpen({
          open: false,
          variant: "error",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsSelector, alertSelector]);

  return (
    <>
      <div ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

export default Map;
