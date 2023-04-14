import styled from "./ArchivedModal.module.css";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { setarcModalValue } from "../../../../actions/actions";
import { useEffect, useState } from "react";

import Chart from "../../../chart/Chart";

function ArchivedModal({ isOpen }) {
  const name = useSelector((state) => state.alarmname.data);
  const time = useSelector((state) => state.alarmtime.data);
  const [realT, setRealT] = useState("");
  const [getArray, setGetArray] = useState([]);
  const [noData, setNoData] = useState(0);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setarcModalValue(false));
  };

  const getAPI = async () => {
    try {
      const newname = name.replace(/:/g, "%3A");

      let offset = new Date(time).getTimezoneOffset() * 60000;

      const realTime = new Date(time) - offset;
      const strTime = new Date(realTime - 0.3 * 3600 * 1000).toISOString();
      const endTime = new Date(realTime + 0.3 * 3600 * 1000).toISOString();

      const strT = strTime.replace(/:/g, "%3A");
      const endT = endTime.replace(/:/g, "%3A");

      const json = await (
        await fetch(
          `http://192.168.100.178:17668/retrieval/data/getData.json?pv=${newname}&from=${strT}&to=${endT}`
        )
      ).json();
      console.log(json);
      setRealT(new Date(realTime).toString());
      setGetArray(json[0].data);
      setNoData(0);
    } catch (error) {
      console.error(error);
      console.log("no data");
      setNoData(1);
    }
  };

  useEffect(() => {
    getAPI();
  }, [isOpen]);

  const minutesGrouping = getArray.reduce((acc, index) => {
    const minute = Math.floor(index.secs + 1 / 60);

    if (acc[minute]) {
      acc[minute].push(index);
    } else {
      acc[minute] = [index];
    }
    return acc;
  }, {});

  const minuteData = Object.entries(minutesGrouping).map(([minute, group]) => {
    const valSum = group.reduce((sum, index) => sum + index.val, 0);
    const valAvg = valSum / group.length;

    const secs = Math.max(...group.map(({ secs }) => secs));

    return { minute, val: valAvg, secs };
  });

  const timeKey = "x";
  const valueKey = "y";
  let offset = new Date(time).getTimezoneOffset() * 60000;

  const drawGraph = minuteData.map((index) => ({
    x: new Date(index.secs * 1000).toLocaleTimeString("en-US", {
      timeZone: "Asia/Seoul",
    }),
    y: index.val,
  }));
  const maxVal = Math.max(...drawGraph.map((item) => item.y));
  const minVal = Math.min(...drawGraph.map((item) => item.y));
  let maxX, minX;
  drawGraph.forEach((item) => {
    if (item.y === maxVal) {
      maxX = item.x;
    }
    if (item.y === minVal) {
      minX = item.x;
    }
  });

  return (
    <ReactModal isOpen={isOpen} className={styled.mbox}>
      <button
        type="button"
        className={styled.btn_close}
        onClick={closeModal}
      ></button>
      <div className={noData === 1 ? styled.nodata : styled.yesdata}>
        <h1>아카이빙 PV가 아닙니다.</h1>
        <h3>(아카이빙이 필요할 경우 담당자에게 문의)</h3>
      </div>
      <div>
        <h1 className={styled.timeTitle}>이벤트 발생 시간 {realT}</h1>
        <div className={styled.contentBody}>
          <div className={styled.chartSty}>
            <h1>{name}</h1>
            <Chart data={drawGraph} timeKey={timeKey} valueKey={valueKey} />
          </div>
          <div className={styled.infos}>
            <h3>Timestamp</h3>
            <table>
              <tbody>
                <tr>
                  <td>최대</td>
                  <td>{maxX}</td>
                  <td>{maxVal.toFixed(5)}</td>
                </tr>
                <tr>
                  <td>최소</td>
                  <td>{minX}</td>
                  <td>{minVal.toFixed(5)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}

export default ArchivedModal;
