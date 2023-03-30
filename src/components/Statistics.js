import axios from "axios";
import { useEffect, useState } from "react";
import BarGraph from "./chart/BarGraph";
import styled from "./Statistics.module.css";

function Statistics() {
  const [gbperYear, setGbperYear] = useState(0);
  const [kbperHour, setkbperHour] = useState(0);
  const [mbperDay, setmbperDay] = useState(0);
  const [getStorage, setGetStorage] = useState([]);
  const [topArray, setTopArray] = useState([]);
  const [topData, setTopData] = useState([]);
  const getAPI = () => {
    axios
      .get("/mgmt/bpl/getStorageRateReport")
      .then((response) => {
        const getData = response.data;

        const dataObj = getData.map((index) => ({
          pvname: index.pvName,
          gbper: Number(index.storageRate_GBperYear),
          kbper: Number(index.storageRate_KBperHour),
          mbper: Number(index.storageRate_MBperDay),
        }));

        const mostArray = dataObj.slice(0, 5);
        let mostPVs = [];
        let mostDatas = [];
        mostArray.map((index) => {
          mostPVs.push(index.pvname);
          mostDatas.push(index.mbper.toFixed(2));
        });

        setTopArray(mostPVs);
        setTopData(mostDatas);

        const sumObj = dataObj.reduce((accumulator, curremtValue) => {
          Object.keys(curremtValue).forEach((key) => {
            accumulator[key] = (accumulator[key] || 0) + curremtValue[key];
          });
          return accumulator;
        }, {});
        setGbperYear(sumObj.gbper);
        setkbperHour(sumObj.kbper);
        setmbperDay(sumObj.mbper);
        const graphData = [
          { name: "GB/Y", value: sumObj.gbper },
          { name: "MB/D", value: sumObj.mbper },
          { name: "KB/H * 10", value: sumObj.kbper / 10 },
        ];
        setGetStorage(graphData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 3600000);
    return () => clearInterval(intervalld);
  }, []);

  return (
    <div className={styled.Abody}>
      <h1>Archiving Storage Rate</h1>
      <div className={styled.statBody}>
        <BarGraph data={getStorage} width="750" height="550" />
        <div className={styled.listBody}>
          <h3>Top5 PVs at data storage</h3>
          <div className={styled.ulBody}>
            <ul className={styled.storageList}>
              {topArray.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
            <ul className={styled.storageList}>
              {topData.map((item) => (
                <li>{item} MB/day</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
