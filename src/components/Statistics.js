import axios from "axios";
import { useEffect, useState } from "react";

function Statistics() {
  const [gbperYear, setGbperYear] = useState(0);
  const [kbperHour, setkbperHour] = useState(0);
  const [mbperDay, setmbperDay] = useState(0);
  const [topArray, setTopArray] = useState([]);
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

        const sumObj = dataObj.reduce((accumulator, curremtValue) => {
          Object.keys(curremtValue).forEach((key) => {
            accumulator[key] = (accumulator[key] || 0) + curremtValue[key];
          });
          return accumulator;
        }, {});
        setGbperYear(sumObj.gbper);
        setkbperHour(sumObj.kbper);
        setmbperDay(sumObj.mbper);
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
    <div>
      <h1>통계 데이터 처리</h1>
      <h3>{gbperYear} GB / Year</h3>
      <h3>{kbperHour} KB / Hour</h3>
      <h3>{mbperDay} MB / Day</h3>
      <h3>Top5 at data storage</h3>
    </div>
  );
}

export default Statistics;
