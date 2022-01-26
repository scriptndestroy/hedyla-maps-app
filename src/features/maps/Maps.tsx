// import "./style.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./Map";
import { Marker } from "./Marker";
import TransitionAlert from "../alert/TransitionAlert";

import {
  setEnd,
  setStart,
  selectMap,
  setFee,
  setPrice,
} from "../maps/mapSlice";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { selectAlert, setOpen } from "../alert/alertSlice";

var stat: any;
const render = (status: Status) => {
  stat = status;
  return <h1>{status}</h1>;
};

const Maps: React.VFC = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const map = useAppSelector(selectMap);  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (map.distance && map.fee) {
      let f = parseFloat(map.fee);
      let r = `Total price: ${map.distance * f} €`;
      console.log(r);
      dispatch(setPrice(r));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.distance, map.fee]);

  useEffect(() => {    
    if (map.errorMsg) {      
      dispatch(
        setOpen({
          open: true,          
          variant: "error",
        })
      );
    }    
  }, [map]);

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  const form = (
    <div
      style={{
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Box style={{ padding: "1rem" }}>
        <FormControl fullWidth className={"space-inputs"}>
          <TextField
            type="number"
            id="zoom"
            name="zoom"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            label="Zoom"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth className={"space-inputs"}>
          <TextField
            type="number"
            id="lat"
            name="lat"
            value={center.lat}
            onChange={(event) =>
              setCenter({ ...center, lat: Number(event.target.value) })
            }
            label="Latitude"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth className={"space-inputs"}>
          <TextField
            type="number"
            id="lng"
            name="lng"
            value={center.lng}
            onChange={(event) =>
              setCenter({ ...center, lng: Number(event.target.value) })
            }
            label="Longitude"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth className={"space-inputs"}>
          <InputLabel id="start-label">Start</InputLabel>
          <Select
            variant="outlined"
            labelId="start-label"
            id="start"
            value={map.start}
            label="Start"
            name="start"
            onChange={(e) => dispatch(setStart(e.target.value))}
          >
            <MenuItem value="{'lat': 23.644524198573688,'lng': 15.029296875}">
              Point 1
            </MenuItem>
            <MenuItem value="madrid, es">Madrid</MenuItem>
            <MenuItem value="chicago, il">Chicago</MenuItem>
            <MenuItem value="st louis, mo">St Louis</MenuItem>
            <MenuItem value="joplin, mo">Joplin, MO</MenuItem>
            <MenuItem value="oklahoma city, ok">Oklahoma City</MenuItem>
            <MenuItem value="amarillo, tx">Amarillo</MenuItem>
            <MenuItem value="gallup, nm">Gallup, NM</MenuItem>
            <MenuItem value="flagstaff, az">Flagstaff, AZ</MenuItem>
            <MenuItem value="winona, az">Winona</MenuItem>
            <MenuItem value="kingman, az">Kingman</MenuItem>
            <MenuItem value="barstow, ca">Barstow</MenuItem>
            <MenuItem value="san bernardino, ca">San Bernardino</MenuItem>
            <MenuItem value="los angeles, ca">Los Angeles</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className={"space-inputs"}>
          <InputLabel id="end-label">End</InputLabel>
          <Select
            variant="outlined"
            labelId="end-label"
            id="end"
            name="end"
            onChange={(e) => dispatch(setEnd(e.target.value))}
            value={map.end}
            label="End"
          >
            <MenuItem value='"lat": 13.838079936422464,"lng": 26.279296875'>
              Point 2
            </MenuItem>
            <MenuItem value="barcelona, es">Barcelona</MenuItem>
            <MenuItem value="chicago, il">Chicago</MenuItem>
            <MenuItem value="st louis, mo">St Louis</MenuItem>
            <MenuItem value="joplin, mo">Joplin, MO</MenuItem>
            <MenuItem value="oklahoma city, ok">Oklahoma City</MenuItem>
            <MenuItem value="amarillo, tx">Amarillo</MenuItem>
            <MenuItem value="gallup, nm">Gallup, NM</MenuItem>
            <MenuItem value="flagstaff, az">Flagstaff, AZ</MenuItem>
            <MenuItem value="winona, az">Winona</MenuItem>
            <MenuItem value="kingman, az">Kingman</MenuItem>
            <MenuItem value="barstow, ca">Barstow</MenuItem>
            <MenuItem value="san bernardino, ca">San Bernardino</MenuItem>
            <MenuItem value="los angeles, ca">Los Angeles</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className={"space-inputs"}>
          <InputLabel id="fees-label">Fees</InputLabel>
          <Select
            variant="outlined"
            labelId="fees-label"
            id="fees"
            name="fees"
            onChange={(e) => dispatch(setFee(e.target.value))}
            value={map.fee}
            label="Fees"
          >
            <MenuItem value="0.50">Truck</MenuItem>
            <MenuItem value="0.25">Van</MenuItem>
          </Select>
        </FormControl>

        <h3>
          {clicks.length === 0 ? "Click on map to add markers" : "Clicks"}
        </h3>
        {clicks.map((latLng, i) => (
          <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
        ))}
        <button onClick={() => setClicks([])}>Clear</button>
      </Box>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <TransitionAlert />
      <Wrapper
        apiKey={"AIzaSyD79G-tsrpY8YTY4W4jW65ZAV6OfSQLAIk"}
        render={render}
      >
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
};

export default Maps;
