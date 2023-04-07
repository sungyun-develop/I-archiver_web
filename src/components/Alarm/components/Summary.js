import PropTypes from "prop-types";
import styled from "./Summary.module.css";
import BarCnt from "../chart/BarCnt";

function Summary({ cnt, index, indexCnt, name, time }) {
  let rTime = new Date(time);
  rTime.setHours(rTime.getHours() + 9);
  const eventTime = rTime.toLocaleString();

  const data = [
    { name: "누적 알람", value: cnt },
    { name: "현재 index", value: indexCnt },
  ];

  return (
    <div className={styled.summary}>
      <div className={styled.indexInfo}>
        <BarCnt data={data} width="400" height="400" />
        <div>
          <h2>최근 index : {index}</h2>
          <h2>누적 발생 알람 수 : {cnt}개</h2>
          <h2>현재 index 알람 수 : {indexCnt}</h2>
        </div>
      </div>
      <div>
        <h2 className={styled.title}>가장 최근 알람 정보</h2>
        <div className={styled.recentInfo}>
          <h2>{name}</h2>
          <h2>{eventTime}</h2>
        </div>
      </div>
    </div>
  );
}

Summary.propTypes = {
  cnt: PropTypes.number.isRequired,
  index: PropTypes.string.isRequired,
  indexCnt: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default Summary;
