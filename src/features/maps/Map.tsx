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
var directionsRenderer: any;
var directionsService: any;

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
  // directionsRenderer.setMap(map ||null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
      directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsService = new window.google.maps.DirectionsService();
    }
  }, [ref, map]);

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

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  useEffect(() => {
    if (mapsSelector.start && mapsSelector.end) {
      let start = mapsSelector.start;
      let end = mapsSelector.end;
      directionsRenderer.setMap(null);
      dispatch(
        callDirectionsAPI({
          directionsService,
          directionsRenderer,
          start,
          end,
          map,
        })
      );
      directionsRenderer.setMap(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
