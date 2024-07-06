import React, { useState, useEffect } from "react";
import { useFacts } from "../services/fact";
import DataLoader from "./dataloader";
const FactPage = (props) => {
  const [substype, setsubstype] = useState("Montly");
  const handlechangetype = () => {
    if (substype == "Montly") setsubstype("Yearly");
    else setsubstype("Montly");
  };
  const usefacts = useFacts();
  const { status, data, error, isFetching } = usefacts;

  return (
    <>
      <h2 className="due-font-service  text-center poppins-thin mt-10 mb-4">
        Fact Page Header
      </h2>
      <DataLoader query={usefacts} />
      <div className="flex flex-col"></div>

      <div className="flex flex-col" onClick={handlechangetype}>
        Change Type {substype}
      </div>

      <div className="flex flex-row">
        {data && (
          <>
            <div className="flex flex-col">{data.source}</div>
            <div className="flex flex-col">{data.text}</div>
          </>
        )}
      </div>
    </>
  );
};

export default FactPage;
