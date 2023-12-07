import axios from "axios";
import styled from "./PingTest.module.css";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "./../../routes/NetWorkList";
import backArrImg from "./../../img/back_arrow.png";

function PingTest({ ip_address }) {
  const [pingRes, setPingRes] = useState(false);
  const [responseTm, setResponseTm] = useState(0);
  const [pingTest, setPingTest] = useState(false);
  const { setLoading3 } = useContext(LoadingContext);

  console.log(useContext(LoadingContext));

  console.log(responseTm);
  const handleIpCheck = (event) => {
    event.preventDefault();
    setLoading3(true);
    setPingTest(true);

    axios
      .get(`http://192.168.100.71:8000/nmsinfo/check-ping/${ip_address}/`)
      .then((response) => {
        console.log("응답...........");
        console.log(response.data.message);
        const regex = /[^0-9.]/g;
        const msg = response.data.message;
        if (response.data.success == true) {
          console.log("수신 성공");
          const result = msg.replace(regex, "");

          console.log("--------------------------------");
          const result_change = parseFloat(
            (parseFloat(result) * Math.pow(10, 6)).toFixed(3)
          );
          console.log(result_change);
          console.log(typeof result_change);
          setResponseTm(result_change);
          console.log(responseTm);
          if (isNaN(result_change)) {
            console.log("실패");
            setPingRes(false);
          } else {
            console.log("성공");
            setPingRes(true);
          }
        } else {
          setPingRes(false);
          setResponseTm("---");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading3(false);
      });
  };

  const handleGoback = (event) => {
    event.preventDefault();
    setPingTest(false);
  };

  useEffect(() => {
    console.log("aaaaaaaaaaaaaaaaaaa");
    setLoading3(false);
  }, []);
  return (
    <div className={styled.testBox}>
      <button
        type="input"
        onClick={handleIpCheck}
        className={
          pingTest
            ? pingRes
              ? styled.toshort1
              : styled.toshort2
            : styled.tolong
        }
      >
        Ping 확인하시겠습니까?
      </button>
      {pingTest ? (
        <div className={styled.pingRes}>
          <div className={pingTest ? styled.BtnClick : styled.noClick}>
            {pingRes ? <h3>결과 : 성공</h3> : <h3>결과 : 응답없음</h3>}
            <h3>응답 시간 : {responseTm} ns</h3>
          </div>
          <button
            type="input"
            className={styled.backBtn}
            onClick={handleGoback}
          >
            <img src={backArrImg}></img>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default PingTest;
