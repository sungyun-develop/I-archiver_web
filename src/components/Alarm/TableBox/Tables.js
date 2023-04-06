import PropTypes from "prop-types";
import TablesLine from "./TablesLine";
import { useState, useEffect } from "react";
import styled from "./Tables.module.css";

function Tables({ array }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 100;
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  let currentItems = array.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = array.length;
  const totalPage = Math.ceil(totalItems / itemPerPage);
  const PageGroupSIze = 10;
  const currentGroup = Math.ceil(currentPage / PageGroupSIze);
  if (array.length < 100) {
    currentItems = array;
  }

  const renderPageNum = () => {
    const pages = [];
    const strPage = (currentGroup - 1) * PageGroupSIze + 1;
    const endPage = Math.min(strPage + PageGroupSIze - 1, totalPage);

    for (let i = strPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </li>
      );
    }
    if (currentGroup > 1) {
      pages.unshift(
        <li
          key="prev"
          className={styled.leadli}
          onClick={() => handlePageChange(strPage - 1)}
        >
          이전
        </li>
      );
    }
    if (currentGroup > 2) {
      pages.unshift(
        <li
          key="first"
          className={styled.leadli}
          onClick={() => handlePageChange(1)}
        >
          처음으로...
        </li>
      );
    }

    if (currentGroup != totalPage) {
      pages.push(
        <li
          key="next"
          className={styled.leadli}
          onClick={() => handlePageChange(endPage + 1)}
        >
          다음
        </li>
      );
    }

    if (currentPage < totalPage - 1) {
      pages.push(
        <li
          key="last"
          className={styled.leadli}
          onClick={() => handlePageChange(totalPage)}
        >
          마지막으로..
        </li>
      );
    }

    return pages;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <table className={styled.table0}>
        <thead className={styled.table0Head}>
          <tr>
            <td>PV NAME</td>
            <td>EVENT TIME</td>
            <td>VALUE</td>
            <td>ALARM SEVERITY</td>
            <td>CURRENT STATUS</td>
            <td>확인</td>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((index, idx) => (
            <TablesLine
              key={idx}
              pvname={index.name}
              evttime={index.time}
              value={index.value}
              state={index.status}
              CurrState={index.current}
              ack={index.ack}
            />
          ))}
        </tbody>
      </table>
      <ul className={styled.pagination}>{renderPageNum()}</ul>
    </div>
  );
}

Tables.propTypes = {
  array: PropTypes.array.isRequired,
};

export default Tables;
