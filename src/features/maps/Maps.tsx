// import "./style.css";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setOpen } from "../alert/alertSlice";
import TransitionAlert from "../alert/TransitionAlert";
import DrawerRes from "../drawer/DrawerRes";
import {
  selectMap,
  setEnd,
  setFee,
  setPrice,
  setStart
} from "../maps/mapSlice";
import Map from "./Map";

const render = (status: Status) => {  
  return <h1>{status}</h1>;
};

const Maps: React.VFC = () => {
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const apiCallRef = useRef((start: any, end: any) => {});

  const map = useAppSelector(selectMap);  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (map.distance && map.fee) {
      let f = parseFloat(map.fee);
      let r = `${(map.distance / 1000) * f} €`;
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
  }, [map, map.errorMsg]);

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  const handleSearchClick = () => {
    if (apiCallRef?.current) {
      apiCallRef.current(map.start, map.end);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key={"start"}>
          <FormControl fullWidth className={"space-inputs"}>
            <TextField
              type="text"
              id="start"
              name="start"
              value={map.start}
              onChange={(e) => dispatch(setStart(e.target.value))}
              label="Start"
              variant="outlined"
            />
          </FormControl>
        </ListItem>
        <ListItem key={"end"}>
          <FormControl fullWidth className={"space-inputs"}>
            <TextField
              type="text"
              id="end"
              name="end"
              onChange={(e) => dispatch(setEnd(e.target.value))}
              value={map.end}
              label="End"
              variant="outlined"
            />
          </FormControl>
        </ListItem>
        <ListItem key={"fees"}>
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
        </ListItem>
        <ListItem key={"search"}>
          <FormControl fullWidth className={"space-inputs"}>
            <Button onClick={handleSearchClick}>Search</Button>
          </FormControl>
        </ListItem>
        <ListItem key={"price"}>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            fontWeight={"bold"}
          >
            Price
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" gutterBottom component="div">
            {map.price}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            fontWeight={"bold"}
          >
            Distance
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" gutterBottom component="div">
            {`${Math.round(map.distance / 1000)} km`}
          </Typography>
        </ListItem>
      </List>
    </div>
  );

  return (
    <DrawerRes elements={drawer}>
      <TransitionAlert />
      <Wrapper
        apiKey={""}
        render={render}
      >
        <Map
          callApi={apiCallRef}
          center={center}
          onIdle={onIdle}
          zoom={zoom}
          style={{
            flexGrow: "1",
            height: "90%",
            position: "relative",
            overflow: "hidden",
          }}
        ></Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
    </DrawerRes>
  );
};

export default Maps;
