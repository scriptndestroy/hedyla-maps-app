import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { callDirectionsAPI, selectMap } from "./mapSlice";
import { useDeepCompareEffectForMaps } from "./utils";

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const mapsSelector = useAppSelector(selectMap);
  let directionsRenderer = new google.maps.DirectionsRenderer();
  let directionsService = new google.maps.DirectionsService();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
      directionsRenderer.setMap(map);
    }
  }, [map, onClick, onIdle]);

  useEffect(() => {
    if (mapsSelector.start && mapsSelector.end) {
      console.log("pasamos por aqui");
      let start = mapsSelector.start;
      let end = mapsSelector.end;
      dispatch(
        callDirectionsAPI({
          directionsService,
          directionsRenderer,
          start,
          end,
        })
      );
    }
  }, [mapsSelector.start, mapsSelector.end]);

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
