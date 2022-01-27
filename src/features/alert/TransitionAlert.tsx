import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAlert, setOpen } from "./alertSlice";
import { selectMap } from "../maps/mapSlice";

const TransitionAlert = () => {
  const map = useAppSelector(selectMap);
  const alert = useAppSelector(selectAlert);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ width: "100%", zIndex: 1, position: "relative" }}>
      <Collapse in={alert.open}>
        <Alert
          severity={alert.variant}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(
                  setOpen({
                    open: false,
                    variant: "error"
                  })
                );
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {map.errorMsg}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default TransitionAlert;
