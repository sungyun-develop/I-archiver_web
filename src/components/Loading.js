import { useEffect } from "react";
import logo from "../img/kaeri_logo.jpg";
import styled from "./Loading.module.css";

function Loading() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      animateText();
    }, 2000); // 2초마다 애니메이션을 호출
    return () => {
      clearInterval(intervalId); // 컴포넌트가 언마운트될 때 interval 해제
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 호출

  const animateText = () => {
    const text = document.querySelector(`.${styled.loadingText}`);
    const letters = text.textContent.split("");
    text.textContent = ""; // 텍스트 초기화

    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.animationDelay = `${index * 0.1}s`; // 각 글자의 애니메이션 지연 시간 설정
      text.appendChild(span);
    });
  };

  return (
    <div className={styled.loadingBody}>
      <img src={logo} className={styled.logo} />
      <h1 className={styled.loadingText}>로딩중입니다... </h1>
      <progress className={styled.progress}></progress>
    </div>
  );
}

export default Loading;
