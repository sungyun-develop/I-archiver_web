import PropTypes from "prop-types";

import PIEChart from "./chart/PIEChart";
import styled from "./DiscoList.module.css";
import { Link } from "react-router-dom";

function DiscoList({ allsize, size, noevent, paused, resno }) {
  const data = [
    { name: "전체 아카이빙", value: allsize },
    { name: "disconnect 수", value: size },
  ];
  const dataE = [
    { name: "전체 아카이빙", value: allsize },
    { name: "no event 수", value: noevent.length },
  ];

  const dataP = [
    { name: "전체 아카이빙", value: allsize },
    { name: "paused 수", value: paused },
  ];

  const colors = ["#0088FE", "#DD2c00"];

  const pvlist = resno.map(function (item) {
    return item.pvname;
  });

  const valuelist = resno.map(function (item) {
    return (item.time / 24).toFixed(0);
  });

  return (
    <div className={styled.Abody}>
      <h1>Archiving Monitoring Status</h1>
      <div className={styled.chartBody}>
        <div className={styled.child}>
          <h2>disconnected Rate</h2>
          <PIEChart data={data} />
        </div>
        <div className={styled.child}>
          <h2>No Event Rate</h2>
          <PIEChart data={dataE} />
        </div>
        <div className={styled.child}>
          <h2>Paused Rate </h2>
          <PIEChart data={dataP} />
        </div>
        <div className={styled.child}>
          <Link to="/archiverStatus/noEvent" className={styled.movedPageU}>
            <h2 className={styled.movedPage}>Recent No Event</h2>
          </Link>

          <div className={styled.ulBody}>
            <ul className={styled.storageList}>
              {pvlist.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
            <ul className={styled.storageList}>
              {valuelist.map((item) => (
                <li>{item}일전</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

DiscoList.propTypes = {
  allsize: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  noevent: PropTypes.array.isRequired,
  paused: PropTypes.number.isRequired,
  resno: PropTypes.array.isRequired,
};

export default DiscoList;
