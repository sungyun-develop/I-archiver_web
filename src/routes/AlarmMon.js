import axios from "axios";
import { useEffect } from "react";

axios.defaults.withCredentials = true;

function AlarmMon() {
  const getAPI = () => {
    axios
      .get("/alarm/accelerator_alarms_state_*/_search")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error occured", error);
      });
  };

  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 1000);
    return () => clearInterval(intervalld);
  }, []);
  return (
    <div>
      <h1>alarm status</h1>
    </div>
  );
}

export default AlarmMon;
