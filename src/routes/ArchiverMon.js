import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import TableLine from "../components/TableLine";
import styled from "./ArchiverMon.module.css";
import { stringify } from "ajv";

axios.defaults.withCredentials = true;

function ArchiverMon() {

  const [getReport, setGetReport] = useState([]);
  const getAPI = () => {
    axios
      .get("/mgmt/bpl/getPVStatus")
      .then((response) => {
        const getData = response.data;
        let today = new Date(dayjs(new Date()).format("M/DD/YYYY HH:mm:ss"));
        const sortedData = getData.map((index) => ({
          pvname: index.pvName,
          state: index.status,
          Constate: index.connectionState,
          event: index.lastEvent,
          delta: today - new Date(index.lastEvent),
        }));

        sortedData.map((index) => {
          const etime = index.event;
          if (etime === "Never" || !etime) {
            index.event = etime;
          } else {
            index.event = etime.replace(/\+09:00/, "").replace(/\?/, "");
          }

        })

        setGetReport(sortedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 5000);
    return () => clearInterval(intervalld);
  }, []);

  return (
    <div>
      <h2>아카이버 어플라이언스 관리 목록</h2>
      <div>
        <h3>전체 아카이빙 갯수 : </h3>
        <h3>{getReport.length}</h3>
      </div>
      <div className={styled.tableBody}>
      <table className={styled.table0}>
        <tr>
          <td>PV NAME</td>
          <td>아카이빙 상태</td>
          <td>연결 상태</td>
          <td>마지막 이벤트</td>
          <td>삭제</td>
          <td>재시작</td>
          <td>삭제</td>
        </tr>
        {getReport.map((index, idx) => (
          <TableLine key={idx} pvname={index.pvname}  state={index.state} Constate={index.Constate} evttime={index.event} delta={index.delta} />
        ))}
      </table>
      </div>
    </div>
  );
}

export default ArchiverMon;
