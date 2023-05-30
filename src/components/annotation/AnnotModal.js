import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { setModalstate } from "../../actions/actions";
import { updateAnnotContent } from "../../actions/actions";
import styled from "./AnnotModal.module.css";
import { SketchPicker } from "react-color";
import { useState } from "react";

function AnnotModal({ isOpen, pickedItem }) {
  const pickedIdx = pickedItem[0];
  const defaultNote = pickedItem[1];
  const defaultColor = pickedItem[2];
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const [fontSize, setFontSize] = useState(14);
  const [title, setTitle] = useState(defaultNote.title);
  const [content, setContent] = useState(defaultNote.label);

  const closeModal = () => {
    dispatch(setModalstate(false));
  };

  const handleClickColor = () => {
    setShowPicker(!showPicker);
  };

  const handleChangeColor = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  const handleChangeFontSize = (event) => {
    setFontSize(parseInt(event.target.value));
  };

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  const handleClickSave = () => {
    console.log("saved!");
    console.log(color);
    const updateContent = [pickedIdx, color, fontSize, title, content];
    dispatch(updateAnnotContent(updateContent));
    dispatch(setModalstate(false));
  };

  console.log(`modal open : ${isOpen}`);

  return (
    <ReactModal isOpen={isOpen} className={styled.annotBox}>
      <div>
        <button
          type="button"
          className={styled.btn_close}
          onClick={closeModal}
        ></button>
        <div>
          <div className={styled.eachObj}>
            <h2>색상 : </h2>
            <div
              onClick={handleClickColor}
              style={{ backgroundColor: color }}
              className={styled.colorMap}
            >
              <h1></h1>
            </div>
          </div>
          {showPicker && (
            <SketchPicker
              color={color}
              className={styled.colorPicker}
              onChange={handleChangeColor}
              value={color}
            />
          )}
        </div>
        <div className={styled.eachObj}>
          <h2>size : </h2>
          <input
            type="number"
            min={1}
            value={fontSize}
            onChange={handleChangeFontSize}
            className={styled.selectorSize}
          />
        </div>
        <div className={styled.eachObj}>
          <h2>제목 :</h2>
          <input
            type="text"
            value={title}
            onChange={handleChangeTitle}
            className={styled.title}
          />
        </div>
        <div>
          <h2>내용 :</h2>
          <input
            type="text"
            value={content}
            onChange={handleChangeContent}
            className={styled.content}
          />
        </div>
        <button
          type="button"
          onClick={handleClickSave}
          className={styled.savedBtn}
        >
          저장
        </button>
      </div>
    </ReactModal>
  );
}

export default AnnotModal;
