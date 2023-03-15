import React, { useEffect, useState } from "react";

function CaData() {
  const [getPV, setGetPV] = useState(0);
  const getAPI = async () => {
    const json = await (await fetch("http://192.168.101.167:3000/data")).json();

    console.log(json);
  };
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 5000);
    return () => clearInterval(intervalld);
  }, []);

  return (
    <div>
      <h2>Hello</h2>
    </div>
  );
}

export default CaData;
