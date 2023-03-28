import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import styled from "./ArchiverMon.module.css";
import TableBox from "../components/TableBox/TableBox";
import reloadImg from "../img/reload.png";
import Statistics from "../components/Statistics";
import DiscoList from "../components/DiscoList";

axios.defaults.withCredentials = true;

function ArchiverMon() {
  const [getReport, setGetReport] = useState([]);
  const [formInput, setFormInput] = useState("");
  const [searchArray, setSearchArray] = useState([]);
  const [goBack, setGoBack] = useState(false);

  const getAPI = () => {
    const url1 = "/mgmt/bpl/getPVStatus";
    const url2 = "/mgmt/bpl/getCurrentlyDisconnectedPVs";
    axios
      .all([axios.get(url1), axios.get(url2)])
      .then(
        axios.spread((response1, response2) => {
          const getData = response1.data;
          const getDisList = response2.data;
          console.log(getDisList);

          let today = new Date(dayjs(new Date()).format("M/DD/YYYY HH:mm:ss"));
          const sortedData = getData.map((index) => ({
            pvname: index.pvName,
            state: index.status,
            Constate: index.connectionState,
            event: index.lastEvent,
            delta: index.lastEvent,
          }));

          sortedData.map((index) => {
            const etime = index.event;
            if (etime === "Never" || !etime) {
              index.event = etime;
            } else {
              index.event = etime.replace(/\+09:00/, "").replace(/\?/, "");
              index.delta = (today - new Date(index.event)) / 1000;
            }
          });

          setGetReport(sortedData);
        })
      )
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

  const filterName = (pvname) => {
    const filterResult = getReport.filter(
      (index) => index.pvname && index.pvname.includes(pvname)
    );
    return filterResult.length > 0 ? filterResult : [];
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (!inputValue) {
      setFormInput("");
      return;
    }
    const pattern = /^[a-zA-Z0-9!:_;?{}*@#$%^&()-]+$/;
    if (pattern.test(inputValue)) {
      setFormInput(inputValue);
    }
  };

  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let selArr = filterName(formInput);
    console.log(selArr);
    setSearchArray(selArr);
    navigate(`search?pvname=${formInput}`);
  };

  const handleClick = () => {
    setGoBack(!goBack);
    setFormInput("");
  };

  return (
    <div>
      <h2>아카이버 어플라이언스 관리 목록</h2>
      <div>
        <h3>전체 아카이빙 갯수 : </h3>
        <h3>{getReport.length}</h3>
      </div>
      <Statistics />
      <DiscoList />
      <div className={styled.tableBody}>
        <div className={styled.formBox}>
          <Link to="/archiverStatus">
            <button type="button" className={styled.reload}>
              <img
                src={reloadImg}
                onClick={handleClick}
                className={goBack ? styled.rotated : styled.rotated2}
              />
            </button>
          </Link>
          <form className={styled.searchingForm} onSubmit={handleFormSubmit}>
            <input
              placeholder="PV 이름을 검색해주세요"
              type="text"
              value={formInput}
              onChange={handleInputChange}
              required
            />
            <input type="submit" value="검색" required />
          </form>
        </div>
        <Routes>
          <Route path="/" element={<TableBox array={getReport} />} />
          <Route path="/search" element={<TableBox array={searchArray} />} />
        </Routes>
      </div>
    </div>
  );
}

export default ArchiverMon;
