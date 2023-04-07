import { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import reloadImg from "../img/reload.png";
import Tables from "../components/Alarm/TableBox/Tables";
import PIEAlarm from "../components/chart/PIEAlarm";
import { useDispatch, useSelector } from "react-redux";
import ArchivedModal from "../components/Alarm/TableBox/modal/ArchivedModal";
import styled from "./AlarmMon.module.css";
import Infos from "../components/Alarm/components/Infos";
import Summary from "../components/Alarm/components/Summary";

function AlarmMon() {
  const [alarmCnt, setAlarmCnt] = useState(0);
  const [indexInfo, setIndexInfo] = useState("");
  const [indexCnt, setIndexCnt] = useState(0);
  const [recentName, setRecentName] = useState("");
  const [recentTime, setRecentTime] = useState("");
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

  const latestCnt = async (name) => {
    const json = await (
      await fetch(`http://192.168.100.39:9200/${name}/_count`)
    ).json();
    setIndexCnt(json.count);
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
            size: 5000,
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
      message: index._source.message,
      current: index._source.current_message,
    }));

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
            size: 5000,
          }),
        }
      )
    ).json();

    const logs = json.hits.hits;

    let latestName = logs[0]._index;
    const latestIndex = latestCnt(latestName);
    setIndexInfo(latestName);
    setRecentName(logs[0]._source.pv);
    setRecentTime(logs[0]._source.message_time);
    const recentLogs = logs.map((index) => ({
      name: index._source.pv,
      time: index._source.time,
      value: index._source.value,
      status: index._source.severity,
      message: index._source.message,
      current: index._source.current_message,
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
    }, 5000);
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
      <div className={styled.summary}>
        <div className={styled.sumChi}>
          <h1>최근 알람현황 (5000개)</h1>
          <PIEAlarm key={statCnt} data={statCnt} />
        </div>
        <div className={styled.sumChi}>
          <h1>알람시스템 현황</h1>
          <Summary
            cnt={alarmCnt}
            index={indexInfo}
            indexCnt={indexCnt}
            name={recentName}
            time={recentTime}
          />
        </div>
        <div className={styled.sumChi}>
          <h1>장치별 담당자</h1>
          <Infos />
        </div>
      </div>
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
