import styled from "./DetailModal.module.css";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { setBoolValue } from "../actions/actions";
import { useSelector } from "react-redux";

ReactModal.setAppElement("#root");

function DetailModal({ isOpen }) {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(setBoolValue(false));
  };
  const infos = useSelector((state) => state.detailInfo.data);

  const names = infos.map(function (item) {
    let changeName = "";
    if (item.name === "Archival params creation time:") {
      changeName = "생성 시간";
      return changeName;
    } else if (item.name === "Archival params modification time:") {
      changeName = "파라미터 수정 시간";
      return changeName;
    } else if (item.name === "Is this a scalar:") {
      changeName = "scalar?";
      return changeName;
    } else if (item.name === "Precision:") {
      changeName = "단위";
      return changeName;
    } else if (item.name === "Is this PV paused:") {
      changeName = "Paused?";
      return changeName;
    } else if (item.name === "Sampling method:") {
      changeName = "샘플링 방법";
      return changeName;
    } else if (item.name === "Extra info - RTYP:") {
      changeName = "TYPE";
      return changeName;
    } else if (item.name === "Estimated event rate (events/sec)") {
      changeName = "events/sec";
      return changeName;
    } else if (item.name === "Estimated storage rate (MB/day)") {
      changeName = "MB/day";
      return changeName;
    } else if (item.name === "Sample buffer capacity") {
      changeName = "샘플 버퍼 용량";
      return changeName;
    } else if (item.name === "Time elapsed since search request (s)") {
      changeName = "마지막 이벤트로부터 경과시간 ";
      return changeName;
    } else {
      return item.name;
    }
  });

  const values = infos.map(function (item) {
    return item.value;
  });

  return (
    <ReactModal isOpen={isOpen} className={styled.mbox}>
      <button
        type="button"
        className={styled.btn_close}
        onClick={closeModal}
      ></button>
      <div className={styled.ulBody}>
        <ul className={styled.storageList_left}>
          {names.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
        <ul className={styled.storageList}>
          {values.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
    </ReactModal>
  );
}

export default DetailModal;
