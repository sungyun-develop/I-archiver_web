import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BarGraph from "../components/chart/BarGraph";
import Chart2 from "../components/Chart2";

function KomacHome() {
  const bestCurr = useSelector((state) => state.beamCurr.data);
  const bestDTL20BCM = useSelector((state) => state.dtl20BCM.data);

  return (
    <div>
      <h1>KOMAC 홈페이지 제작 중...</h1>
      <div>목표 : 빔정보를 포함하여 바로가기들 구현</div>
      <h1>---------------------------------</h1>

      <div>
        <BarGraph data={bestCurr} width="800" height="600" />
        <Chart2 data={bestDTL20BCM} />
      </div>
    </div>
  );
}

export default KomacHome;
