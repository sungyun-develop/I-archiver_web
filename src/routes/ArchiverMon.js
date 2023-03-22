import { useState, useEffect } from "react";
import axios from "axios";

import TableLine from "../components/TableLine";
import styled from "./ArchiverMon.module.css";

axios.defaults.withCredentials = true;

function ArchiverMon() {
  const [getReportN, setGetReportN] = useState([]);
  const [getReportD, setGetReportD] = useState([]);
  const [getReport, setGetReport] = useState([]);
  const getAPI = () => {
    axios
      .get("/mgmt/bpl/getCurrentlyDisconnectedPVs")
      .then((response) => {
        const getData = response.data;

        const sortedData = getData.map((index) => ({
          pvname: index.pvName,
          date: index.connectionLostAt,
        }));

        const name = getData.map((index) => index.pvName);
        const date = getData.map((index) => index.connectionLostAt);
        setGetReportN(name);
        setGetReportD(date);
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
      <h2>현재 연결되지 않은 PV 목록</h2>
      <table className={styled.table0}>
        <tr>
          <td>PV NAME</td>
          <td>DISCONNECT TIME</td>
          <td>정지</td>
          <td>재시작</td>
          <td>상태</td>
          <td>삭제</td>
        </tr>
        {getReport.map((index, idx) => (
          <TableLine key={idx} pvname={index.pvname} date={index.date} />
        ))}
      </table>
    </div>
  );
}

export default ArchiverMon;
