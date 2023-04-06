import { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import reloadImg from "../img/reload.png";
import Tables from "../components/Alarm/TableBox/Tables";
import PIEAlarm from "../components/chart/PIEAlarm";
import { useDispatch, useSelector } from "react-redux";
import ArchivedModal from "../components/Alarm/TableBox/modal/ArchivedModal";
import styled from "./AlarmMon.module.css";
import Operator from "../components/Alarm/components/Operator";

function AlarmMon() {
  const [alarmCnt, setAlarmCnt] = useState(0);
  const [statCnt, setStatCnt] = useState([]);
  const [alarmData, setAlarmData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [goBack, setGoBack] = useState(false);

  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.arcmodalSts);

  const getCnt = async () => {
    const json = await (
      await fetch(
        "http://192.168.100.39:9200/accelerator_alarms_state_*/_count"
      )
    ).json();
    setAlarmCnt(json.count);
    getLog();
  };

  const getSearchResult = async (name) => {
    const json = await (
      await fetch(
        "http://192.168.100.39:9200/accelerator_alarms_state_*/_search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              match: {
                pv: `${name}`,
              },
            },
            sort: [
              {
                message_time: {
                  order: "desc",
                },
              },
            ],
            from: 0,
            size: 2000,
          }),
        }
      )
    ).json();
    const logs = json.hits.hits;
    console.log(logs);
    const recentLogs = logs.map((index) => ({
      name: index._source.pv,
      time: index._source.time,
      value: index._source.value,
      status: index._source.severity,
      current: index._source.current_message,
      ack: index._source.notify,
    }));
    console.log(recentLogs);
    setSearchData(recentLogs);
  };
  const getLog = async () => {
    const json = await (
      await fetch(
        `http://192.168.100.39:9200/accelerator_alarms_state_*/_search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              match_all: {},
            },
            sort: [
              {
                message_time: {
                  order: "desc",
                },
              },
            ],
            from: 0,
            size: 2000,
          }),
        }
      )
    ).json();

    const logs = json.hits.hits;
    const recentLogs = logs.map((index) => ({
      name: index._source.pv,
      time: index._source.time,
      value: index._source.value,
      status: index._source.severity,
      current: index._source.current_message,
      ack: index._source.notify,
    }));
    setAlarmData(recentLogs);

    const names = recentLogs.map((item) => item.name);
    const vacs = names.filter(
      (name) => name.includes("VAC") || name.includes("TMP")
    );

    const mods = names.filter(
      (name) => name.includes("Mod") || name.includes("IGBT")
    );
    const rfs = names.filter(
      (name) =>
        name.includes("KIRCH") ||
        name.includes("K03") ||
        name.includes("K20") ||
        name.includes("K101") ||
        name.includes("K102") ||
        name.includes("K103") ||
        name.includes("K104") ||
        name.includes("K105") ||
        name.includes("K106") ||
        name.includes("K107")
    );

    const pss = names.filter(
      (name) =>
        (name.includes("PS:") &&
          (name.includes("QMP") ||
            name.includes("BM") ||
            name.includes("OMP") ||
            name.includes("ACM"))) ||
        name.includes("CURR") ||
        name.includes("VOLT")
    );

    const vibes = names.filter((name) => name.includes("Vibe:"));
    const rccss = names.filter((name) => name.includes("RCCS"));

    setStatCnt([
      { name: "VAC", value: vacs.length },
      { name: "RCCS", value: rccss.length },
      { name: "MOD", value: mods.length },
      { name: "RF", value: rfs.length },
      { name: "PS", value: pss.length },
      { name: "Vibe", value: vibes.length },
    ]);
  };

  useEffect(() => {
    getCnt();
    const intervalld = setInterval(() => {
      getCnt();
    }, 2000);
    return () => clearInterval(intervalld);
  }, []);

  const navigate = useNavigate();
  const handleFormSubmit = (event) => {
    event.preventDefault();
    getSearchResult(searchName);
    navigate(`search?`);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (!inputValue) {
      setSearchName("");
      return;
    }
    const pattern = /^[a-zA-Z0-9!:_;?{}*@#$%^&()-]+$/;
    if (pattern.test(inputValue)) {
      setSearchName(inputValue);
    }
  };

  const handleClick = () => {
    setSearchName("");
    setGoBack(!goBack);
  };

  return (
    <div>
      <h1>alarm status</h1>
      <h2>기록된 총 알람 수 : {alarmCnt}개</h2>
      <h3>
        table 클릭 시 각 이름 별 event 발생 시간 전후 1시간 데이터 보여주기
      </h3>
      <PIEAlarm key={statCnt} data={statCnt} />
      <Operator />
      <div className={styled.formBox}>
        <Link to="/alarm">
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
            value={searchName}
            onChange={handleInputChange}
            required
          />
          <input type="submit" value="검색" required />
        </form>
      </div>
      <Routes>
        <Route path="/" element={<Tables array={alarmData} />} />
        <Route path="/search?" element={<Tables array={searchData} />} />
      </Routes>
      <ArchivedModal isOpen={modalState} />
    </div>
  );
}

export default AlarmMon;
