import PropTypes from "prop-types";
import axios from "axios";
import styled from "./TableLine.module.css";
import { useState } from "react";
import DetailModal from "./DetailModal";

function TableLine({ pvname, state, Constate, evttime, delta }) {
  const [modalOpen, setModalOpen] = useState(false);
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
    console.log(name);
    setModalOpen(true);
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
