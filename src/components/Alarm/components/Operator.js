import styled from "./Operator.module.css";

function Operator() {
  return (
    <div className={styled.body}>
      <h3>알람 그룹별 담당자 및 조치 방법</h3>
      <ul className={styled.grp}>
        <li>진공</li>
        <li>RCCS</li>
        <li>모듈레이터</li>
        <li>RF</li>
        <li>전자석</li>
        <li>통신</li>
        <li>기타</li>
      </ul>
      <ul>
        <li>정 : 김대일</li>
        <li>정 : 김경현</li>
        <li>정 : 정해성</li>
        <li>정 : 김성구</li>
        <li>정 : 정원혁</li>
        <li>정 : 김재하</li>
        <li>정 : 김경현</li>
      </ul>
      <ul>
        <li>부 : 조문호</li>
        <li>부 : 정원혁</li>
        <li>부 : 정원혁</li>
        <li>부 : 정원혁</li>
        <li>부 : 조문호</li>
        <li>부 : 조성윤</li>
        <li>부 : </li>
      </ul>
    </div>
  );
}

export default Operator;
