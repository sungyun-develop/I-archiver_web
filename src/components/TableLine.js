import PropTypes from "prop-types";
import axios from "axios";

function TableLine({ pvname, date }) {
  const pauseStart = (name) => {
    console.log(name);
    /*axios
    .post("/mgmt/bpl/pauseArchivingPV?pv=")
    .then((response) => {
      console.log("File update!");
    })
    .catch((error) => {
      console.error("Error occured", error);
    });*/
  };
  return (
    <tr>
      <td>{pvname}</td>
      <td>{date}</td>
      <td>
        <input type="button" value="pause" onClick={() => pauseStart(pvname)} />
      </td>
      <td>
        <input type="button" value="resume" />
      </td>
    </tr>
  );
}

TableLine.propTypes = {
  pvname: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default TableLine;
