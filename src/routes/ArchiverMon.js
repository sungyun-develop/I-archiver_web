import { useState, useEffect, useRef } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { useDispatch } from "react-redux";
import { addData, updateData, setBoolValue } from "../actions/actions";
import { useSelector } from "react-redux";

import styled from "./ArchiverMon.module.css";
import TableBox from "../components/TableBox/TableBox";
import reloadImg from "../img/reload.png";
import Statistics from "../components/Statistics";
import DiscoList from "../components/DiscoList";
import DetailModal from "../components/DetailModal";

axios.defaults.withCredentials = true;

function ArchiverMon() {
  const [getReport, setGetReport] = useState([]);
  const [formInput, setFormInput] = useState("");
  const [searchArray, setSearchArray] = useState([]);
  const [goBack, setGoBack] = useState(false);

  const [allList, setAllList] = useState(0);
  const [disList, setDisList] = useState(0);
  const [pausedCnt, setPausedCnt] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [recentNo, setRecentNo] = useState([]);

  //redux
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modalState);

  const getAPI = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const url1 = "/mgmt/bpl/getPVStatus";
    const url2 = "/mgmt/bpl/getCurrentlyDisconnectedPVs";
    const url3 = "/mgmt/bpl/getEventRateReport";
    const url4 = "/mgmt/bpl/getPausedPVsReport";
    const url5 = "/mgmt/bpl/getTimeSpanReport";
    axios
      .all([
        axios.get(url1),
        axios.get(url2),
        axios.get(url3),
        axios.get(url4),
        axios.get(url5),
      ])
      .then(
        axios.spread(
          (response1, response2, response3, response4, response5) => {
            const getData = response1.data;
            const getDisList = response2.data;
            const getEventList = response3.data;
            const getPaused = response4.data;
            const getTimeList = response5.data;

            //compared with current time and export data
            let timeList = Object.keys(getTimeList);
            let tempTime = [];
            timeList.map((index) => {
              let lastEvent = Math.floor(
                (currentTime - Number(getTimeList[index].lastEvent)) / 3600
              );
              if (lastEvent >= 36 && lastEvent < 500) {
                tempTime.push({ pvname: index, time: lastEvent });
              }
            });
            tempTime.sort(function (a, b) {
              return a["time"] - b["time"];
            });

            //remove bi
            const ttty = tempTime;
            const names = ttty.map(function (item) {
              return item.pvname;
            });
            console.log(names.length);

            //recent no event list
            dispatch(updateData(tempTime));
            setRecentNo(tempTime.slice(0, 5));

            //getDisconnect List
            setAllList(getData.length);
            setDisList(getDisList.length);
            //get Paused Count
            setPausedCnt(getPaused.length);

            //getEventRate List

            let zerodata = [];
            getEventList.map((index) => {
              if (index.eventRate == 0) {
                zerodata.push(index.pvName);
              }
            });
            setEventList(zerodata);

            let today = new Date(
              dayjs(new Date()).format("M/DD/YYYY HH:mm:ss")
            );
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
          }
        )
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
      <div className={styled.chartBody}>
        <Statistics />
        <DiscoList
          allsize={allList}
          size={disList}
          noevent={eventList}
          paused={pausedCnt}
          resno={recentNo}
        />
      </div>
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

          <DetailModal isOpen={modalState} />

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
