import PropTypes from "prop-types";
import axios from "axios";
import styled from "./TableLine.module.css"




function TableLine({ pvname, state, Constate, evttime, delta }) {




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
  
  
  return (
    <tr className={Constate === "false" ? styled.statusColor0 : styled.statusColor1}>
      <td>{pvname}</td>
      <td>{state}</td>
      <td>{Constate}</td>
      <td>{evttime}</td>
      <td>{delta}</td>
      <td>
        <input className={styled.buttonStyle} type="button" value="pause" onClick={() => pauseStart(pvname)} />
      </td>
      <td>
        <input className={styled.buttonStyle} type="button" value="resume" onClick={() => resumeStart(pvname)} />
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
  Constate: PropTypes.string.isRequired,
  evttime: PropTypes.string.isRequired,
  delta: PropTypes.number.isRequired,
};

export default TableLine;
