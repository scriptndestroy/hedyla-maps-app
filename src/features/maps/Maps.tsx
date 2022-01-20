// import "./style.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./Map";
import { Marker } from "./Marker";
import { setEnd, setStart, selectMap } from "../maps/mapSlice";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

var stat: any;
const render = (status: Status) => {
  stat = status;
  return <h1>{status}</h1>;
};

const Maps: React.VFC = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(3); // initial zoom
  //   const [startValue, setStartValue] = React.useState("chicago, il");
  //   const [endValue, setEndValue] = React.useState("chicago, il");
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const [fee, setFee] = useState<string>("0");
  const [price, setPrice] = useState<number>(0);
  const map = useAppSelector(selectMap);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let f = parseFloat(fee);
    if (map.distance && f) {
      console.log(`Total price: ${map.distance * f} €`);
      setPrice(price);
    }
  }, [map.distance, fee, price]);

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
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
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
          <MenuItem value="">Select start</MenuItem>
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
          <MenuItem value="">Select end</MenuItem>
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
        <select
          id="fees"
          name="fees"
          onChange={(event) => setFee(event.target.value)}
        >
          <option value="0">Select fee</option>
          <option value="0.50">Truck</option>
          <option value="0.25">Van</option>
        </select>
      </FormControl>

      <h3>{clicks.length === 0 ? "Click on map to add markers" : "Clicks"}</h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}
      <button onClick={() => setClicks([])}>Clear</button>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={""}
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
