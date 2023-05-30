import { useState } from "react";
import styled from "./ChartSearching.module.css";
import { useEffect } from "react";

function ChartSearching() {
  const [PVlist, setPVlist] = useState([]);
  const [searchingName, setSearchingName] = useState("");

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const json = await (await fetch("mgmt/bpl/getAllPVs")).json();
    setPVlist(json);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    getList();
  };

  const handleChangeName = (event) => {
    setSearchingName(event.target.value);
  };
  return (
    <div>
      <form className={styled.searchingForm} onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="PV 이름을 검색해주세요"
          required
          onChange={handleChangeName}
        />
        <input type="submit" value="검색" required />
      </form>
    </div>
  );
}

export default ChartSearching;
