import PropTypes from "prop-types";
import axios from "axios";
import styled from "./TableLine.module.css";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { setBoolValue, updateInfo } from "../actions/actions";

function TableLine({ pvname, state, Constate, evttime, delta }) {
  //redux
  const dispatch = useDispatch();

  const pauseStart = (name) => {
    axios
      .post(`/mgmt/bpl/pauseArchivingPV?pv=${name}`, 1)
      .then((response) => {
        console.log(`Pause!! ${name}`);
      })
      .catch((error) => {
        console.error("Pause Failed", error);
      });
  };

  const resumeStart = (name) => {
    axios
      .post(`/mgmt/bpl/resumeArchivingPV?pv=${name}`, 1)
      .then((response) => {
        console.log("Resume!!");
      })
      .catch((error) => {
        console.error("Resume Failed", error);
      });
  };

  const detailPage = (name) => {
    axios
      .get(`/mgmt/bpl/getPVDetails?pv=${name}`)
      .then((response) => {
        const getData = response.data;

        const filterData = getData.filter(
          (item) =>
            item.name === "Precision:" ||
            item.name === "PV Name" ||
            item.name === "Extra info - RTYP:" ||
            item.name === "Is this a scalar:" ||
            item.name === "Archival params creation time:" ||
            item.name === "Archival params modification time:" ||
            item.name === "Is this PV paused:" ||
            item.name === "Sampling method:" ||
            item.name === "Sampling Period:" ||
            item.name === "Are we using PVAccess:" ||
            item.name === "Sampling Period:" ||
            item.name === "Estimated event rate (events/sec)" ||
            item.name === "Estimated storage rate (MB/day)" ||
            item.name === "Sample buffer capacity" ||
            item.name === "Time elapsed since search request (s)"
        );

        dispatch(updateInfo(filterData));

        dispatch(setBoolValue(true));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <tr
      className={
        Constate === "false"
          ? styled.statusColor0
          : Number(delta) > 86400
          ? styled.statusColor1
          : styled.statusColor2
      }
    >
      <td onClick={() => detailPage(pvname)} className={styled.nameColumn}>
        {pvname}
      </td>
      <td>{state}</td>
      <td>{!Constate ? "-" : Constate}</td>
      <td>{!evttime ? "-" : evttime}</td>
      <td>
        <input
          className={styled.buttonStyle}
          type="button"
          value="pause"
          onClick={() => pauseStart(pvname)}
        />
      </td>
      <td>
        <input
          className={styled.buttonStyle}
          type="button"
          value="resume"
          onClick={() => resumeStart(pvname)}
        />
      </td>
      <td>
        <input type="button" value="delete" />
      </td>
    </tr>
  );
}

TableLine.propTypes = {
  pvname: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  Constate: PropTypes.string,
  evttime: PropTypes.string,
  delta: PropTypes.string.isRequired,
};

export default TableLine;
