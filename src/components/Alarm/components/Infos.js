import styled from "./Infos.module.css";
import { Link } from "react-router-dom";

function Infos() {
  return (
    <div className={styled.body}>
      <a href="/manual" className={styled.manual}>
        <h2>조치 메뉴얼 바로가기</h2>
      </a>
      <div className={styled.oper}>
        <h2>가속기 운영 총괄 : 윤상필</h2>
        <div className={styled.info}>
          <ul className={styled.title0}>
            <li>진공</li>
            <li>RCCS / 누수</li>
            <li>모듈레이터</li>
            <li>RF</li>
            <li>전자석</li>
            <li>통신</li>
            <li>기타</li>
          </ul>
          <ul className={styled.title}>
            <li>정 : 김대일</li>
            <li>정 : 김경현</li>
            <li>정 : 정해성</li>
            <li>정 : 김성구</li>
            <li>정 : 정원혁</li>
            <li>정 : 김재하</li>
            <li>정 : 김경현</li>
          </ul>
          <ul className={styled.title}>
            <li>부 : 조문호</li>
            <li>부 : 정원혁</li>
            <li>부 : 정원혁</li>
            <li>부 : 정원혁</li>
            <li>부 : 조문호</li>
            <li>부 : 조성윤</li>
            <li>부 : </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Infos;
