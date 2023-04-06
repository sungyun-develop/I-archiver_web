import PropTypes from "prop-types";
import axios from "axios";
import styled from "./TablesLine.module.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setarcModalValue,
  updateAname,
  updateAtime,
} from "../../../actions/actions";

function TablesLine({ pvname, evttime, value, state, CurrState, ack }) {
  //redux
  const dispatch = useDispatch();

  const dataArchive = (name) => {
    console.log(name);
    console.log(evttime);
    let replaceName = name;
    if (name.startsWith("PS:")) {
      replaceName = name.replace(/:ALARM$/, "");
      dispatch(updateAname(replaceName));
      console.log("aa");
    } else {
      dispatch(updateAname(name));
      console.log("bb");
    }

    dispatch(updateAtime(evttime));
    dispatch(setarcModalValue(true));
  };

  let eTime = new Date(evttime);
  eTime.setHours(eTime.getHours() + 9);
  const eventTime = eTime.toLocaleString();

  return (
    <tr
      className={
        state === "OK"
          ? styled.statusColor0
          : state === "MAJOR"
          ? styled.statusColor1
          : state === "MAJOR_ACK"
          ? styled.statusColor2
          : state === "MINOR"
          ? styled.statusColor3
          : styled.statusColor4
      }
    >
      <td
        onClick={() => dataArchive(pvname, evttime)}
        className={styled.nameColumn}
      >
        {pvname}
      </td>
      <td>{eventTime}</td>
      <td>{value}</td>
      <td>{state}</td>
      <td>{CurrState}</td>
      <td>{ack}</td>
    </tr>
  );
}

TablesLine.propTypes = {
  pvname: PropTypes.string.isRequired,
  evttime: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  CurrState: PropTypes.string.isRequired,
  ack: PropTypes.string.isRequired,
};

export default TablesLine;
