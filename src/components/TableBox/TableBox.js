import PropTypes from "prop-types";
import TableLine from "../TableLine";
import { useState, useEffect } from "react";
import styled from "./TableBox.module.css";

function TableBox({ array }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 100;
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = array.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = array.length;
  const totalPage = Math.ceil(totalItems / itemPerPage);
  const PageGroupSIze = 10;
  const currentGroup = Math.ceil(currentPage / PageGroupSIze);
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
            <td>아카이빙 상태</td>
            <td>연결 상태</td>
            <td>마지막 이벤트 시간</td>
            <td>정지</td>
            <td>재시작</td>
            <td>삭제</td>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((index, idx) => (
            <TableLine
              key={idx}
              pvname={index.pvname}
              state={index.state}
              Constate={index.Constate}
              evttime={index.event}
              delta={!index.delta ? "" : index.delta.toString()}
            />
          ))}
        </tbody>
      </table>
      <ul className={styled.pagination}>{renderPageNum()}</ul>
    </div>
  );
}

TableBox.propTypes = {
  array: PropTypes.array.isRequired,
};

export default TableBox;
