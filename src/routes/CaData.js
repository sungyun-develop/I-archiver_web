import React, { useEffect, useState } from "react";
import Chart2 from "../components/Chart2";
import styled from "./CaData.module.css";
import BarGraph from "../components/chart/BarGraph";

function CaData() {
  const [getionCURR, setGetionCURR] = useState(0);
  const [getlebtCURR, setGetlebtCURR] = useState(0);
  const [getrfqCURR, setGetrfqCURR] = useState(0);
  const [getdtl22CURR, setGetdtl22CURR] = useState(0);
  const [getdtl23CURR, setGetdtl23CURR] = useState(0);
  const [getdtl24CURR, setGetdtl24CURR] = useState(0);
  const [get107CURR, setGet107CURR] = useState(0);
  const [meanCURR, setMeanCURR] = useState(0);
  const [meanPower, setMeanPower] = useState(0);
  const [currArray, setCurrArray] = useState([]);
  const [getbeamsts, setGetbeamsts] = useState(0);
  const [getWidth, setGetWidth] = useState(0);
  const [getEnergy, setGetEnergy] = useState(0);
  const [getRepitition, setGetRepitition] = useState(0);

  const [maxCurr, setMaxCurr] = useState([]);

  const [RFQArray, setRFQArray] = useState([]);
  const [DTL22Array, setDTL22Array] = useState([]);
  const [DTL23Array, setDTL23Array] = useState([]);
  const [DTL24Array, setDTL24Array] = useState([]);

  const [chartData, setChartData] = useState([]);
  const getAPI = async () => {
    const json = await (
      await fetch("http://192.168.100.52:3000/getData")
    ).json();
    const getIon = Number(json.ionCURR).toFixed(2);
    setGetionCURR(getIon);
    const getLebt = Number(json.lebtCURR).toFixed(2);
    setGetlebtCURR(getLebt);
    const getRfq = Number(json.rfqCURR).toFixed(2);
    setGetrfqCURR(getRfq);
    const getDtl22 = Number(json.dtl22CURR).toFixed(2);
    setGetdtl22CURR(getDtl22);
    const getDtl23 = Number(json.dtl23CURR).toFixed(2);
    setGetdtl23CURR(getDtl23);
    const getDtl24 = Number(json.dtl24CURR).toFixed(2);
    setGetdtl24CURR(getDtl24);
    const getDtl107 = Number(json.dtl107CURR).toFixed(2);
    setGet107CURR(getDtl107);
    const getRep = json.repitition;
    setGetRepitition(getRep);

    const getCurrArr = [
      {
        name: "ion",
        value: json.ionCURR,
      },
      { name: "lebt", value: json.lebtCURR },
      { name: "rfq", value: json.rfqCURR },
      { name: "dtl22", value: json.dtl22CURR },
      { name: "dtl23", value: json.dtl23CURR },
      { name: "dtl24", value: json.dtl24CURR },
      { name: "dtl107", value: json.dtl107CURR },
    ];
    setCurrArray(getCurrArr);
    setMaxCurr(getCurrArr);
    const getBeamSts = json.beamSTS;
    setGetbeamsts(getBeamSts);

    const eng = 0;
    const wthEnergy = json.Beam_Energy;
    if (wthEnergy == 9) {
      setGetEnergy(100);
      const eng = 100;
    } else if (wthEnergy == 8) {
      setGetEnergy(90);
      const eng = 90;
    } else if (wthEnergy == 7) {
      setGetEnergy(81);
      const eng = 81;
    } else if (wthEnergy == 6) {
      setGetEnergy(69);
      const eng = 69;
    } else if (wthEnergy == 5) {
      setGetEnergy(57);
      const eng = 57;
    } else if (wthEnergy == 4) {
      setGetEnergy(45);
      const eng = 45;
    } else if (wthEnergy == 3) {
      setGetEnergy(33);
      const eng = 33;
    } else if (wthEnergy == 2) {
      setGetEnergy(20);
      const eng = 20;
    } else {
      setGetEnergy(0);
      const eng = 0;
    }

    const width = Number(json.Pulse_width);
    setGetWidth(width);

    const meancurr = getDtl107 * width * getRep * 0.001;
    setMeanCURR(meancurr.toFixed(3));
    setMeanPower(meancurr * eng);

    const strArray0 = json.RFQ_BCM;
    const strArray1 = json.DTL22_BCM;
    const strArray2 = json.DTL23_BCM;
    const strArray3 = json.DTL24_BCM;
    const toArray0 = strArray0.split(",");
    const toArray1 = strArray1.split(",");
    const toArray2 = strArray2.split(",");
    const toArray3 = strArray3.split(",");
    const typeArray0 = Object.values(toArray0);
    const typeArray1 = Object.values(toArray1);
    const typeArray2 = Object.values(toArray2);
    const typeArray3 = Object.values(toArray3);
    const newData0 = typeArray0.slice(0, Number(width) + 50);
    const newData1 = typeArray1.slice(0, Number(width) + 50);
    const newData2 = typeArray2.slice(0, Number(width) + 50);
    const newData3 = typeArray3.slice(0, Number(width) + 50);
    const toNumbers = (arr) => arr.map(Number);
    const tempData = [];
    for (let i = 0; i <= newData0.length; i++) {
      tempData.push({
        label: i,
        RFQ: toNumbers(newData0)[i],
        DTL22: toNumbers(newData1)[i],
        DTL23: toNumbers(newData2)[i],
        DTL24: toNumbers(newData3)[i],
      });
    }

    setChartData(tempData);
  };
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 100);
    return () => clearInterval(intervalld);
  }, []);

  return (
    <div>
      <h2>RFQ-DTL20 Beam Current Monitor </h2>
      <h1 className={getbeamsts == 1 ? styled.on : styled.off}>
        {getbeamsts == 1 ? "빔조사중" : "빔 대기중"}
      </h1>
      <div className={styled.beamCurr}>
        <table>
          <tr>
            <td>이온원</td>
            <td>{getionCURR}mA</td>
          </tr>
          <tr>
            <td>LEBT</td>
            <td>{getlebtCURR}mA</td>
          </tr>
          <tr>
            <td>RFQ</td>
            <td>{getrfqCURR}mA</td>
          </tr>
          <tr>
            <td>DTL22</td>
            <td>{getdtl22CURR}mA</td>
          </tr>
          <tr>
            <td>DTL23</td>
            <td>{getdtl23CURR}mA</td>
          </tr>
          <tr>
            <td>DTL24</td>
            <td>{getdtl24CURR}mA</td>
          </tr>
          <tr>
            <td>DTL107</td>
            <td>{get107CURR}mA</td>
          </tr>
        </table>
        <BarGraph data={currArray} />
      </div>
      <div className={styled.beamsts}>
        <h3>빔펄스폭 : {getWidth} us</h3>
        <h3>에너지 : {getEnergy} MeV</h3>
        <h3>반복률 : {getRepitition} Hz</h3>
        <h3>평균전류 : {meanCURR}uA</h3>
        <h3>평균전력 : {meanPower}W</h3>
      </div>
      <Chart2 data={chartData} />
    </div>
  );
}

export default CaData;
