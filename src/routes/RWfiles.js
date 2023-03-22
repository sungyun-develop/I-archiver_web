import axios from "axios";
import { get } from "lodash";

import { useState, useEffect } from "react";
import styled from "./RWfiles.module.css";

function RWfiles() {
  const [getSource, setGetSource] = useState("");
  const [changedText, setChangedText] = useState("");
  const [isChecked, setIsChecked] = useState(0);
  const getAPI = () => {
    axios
      .get("http://192.168.101.167:4000/getData")
      .then((response) => {
        const getOrigin = JSON.stringify(response.data, null, 2);

        setGetSource(
          getOrigin
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\/g, "")
            .replace(/"/g, "")
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAPI();
  }, []);
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 1000);
    return () => clearInterval(intervalld);
  }, []);

  const togleSwitch = (event) => {
    setIsChecked(event.target.checked);
    setChangedText(getSource);
  };

  const savedResult = () => {
    const newData = changedText;

    axios
      .post("http://192.168.101.167:4000/updateData", { newData })
      .then((response) => {
        console.log("File update!");
      })
      .catch((error) => {
        console.error("Error occured", error);
      });
  };

  const restartIOC = () => {
    const confirmClick = window.confirm("정말로 재시작을 할까요?");
    if (confirmClick) {
      axios
        .post("http://192.168.101.167:4000/restartIOC")
        .then((response) => {
          console.log("IOC restarted Success!");
        })
        .catch((error) => {
          console.error("Failed to restart", error);
        });
    }
  };

  return (
    <div>
      <h1>IOC db 수정</h1>
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onClick={togleSwitch}
        ></input>
        <input type="button" onClick={savedResult} value="Save"></input>
        <input type="button" onClick={restartIOC} value="restart"></input>
      </div>
      <div className={styled.dbfile}>
        {isChecked ? (
          <textarea
            readOnly={false}
            value={changedText}
            onChange={(e) => setChangedText(e.target.value)}
          ></textarea>
        ) : getSource ? (
          <pre>{getSource}</pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default RWfiles;
