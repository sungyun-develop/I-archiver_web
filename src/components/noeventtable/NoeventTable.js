import { useSelector } from "react-redux";
import styled from "./NoeventTable.module.css";

function NoeventTable() {
  const eventList = useSelector((state) => state.data.data);

  const names = eventList.map(function (item) {
    return item.pvname;
  });

  const times = eventList.map(function (item) {
    return (item.time / 24).toFixed(0);
  });

  return (
    <div className={styled.Abody}>
      <h1>마지막 EVENT로부터 2일- 20일</h1>
      <div className={styled.ulBody}>
        <ul className={styled.storageList}>
          {names.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
        <ul className={styled.storageList}>
          {times.map((item) => (
            <li>{item}일전</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NoeventTable;
