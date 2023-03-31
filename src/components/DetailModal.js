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
  console.log("adddd");
  console.log(infos);

  return (
    <ReactModal isOpen={isOpen} className={styled.mbox}>
      <button
        type="button"
        className={styled.btn_close}
        onClick={closeModal}
      ></button>
      <div>It is modal</div>
    </ReactModal>
  );
}

export default DetailModal;
