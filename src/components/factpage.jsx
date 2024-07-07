import React, { useState, useEffect,useContext } from "react";
import { useFacts,useUpdateFact } from "../services/fact";
import DataLoader from "./dataloader";
import { GlobalStateProvider,GlobalStateContext} from '../services/globalstate'


const FactPage = (props) => {
  const [substype, setsubstype] = useState("Montly");

  const handlechangetype = () => {
    if (substype == "Montly") setsubstype("Yearly");
    else setsubstype("Montly");
  };

  const [state, setState]=useContext(GlobalStateContext)
  const usefacts = useFacts();
  const { status, data, error, isFetching } = usefacts;
  const {mutate,mutateAsync}=useUpdateFact();
  const handleupdate =  async () => {
    const tobeupdate={...data}
    tobeupdate.source='1'+tobeupdate.source
    mutate(tobeupdate)
    //await mutateAsync(tobeupdate)
  };

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
      <div className="flex flex-col my-2 bg-secondary" onClick={handleupdate}>
        update {data && (<>{data.source}</>)}
      </div>
      <div className="flex flex-col bg-primary" onClick={handlechangetype}>
        GlobState AsaConsumerCode {state.AsaConsumerCode}
      </div>

      <div className="d-flex flex-row">
        {data && (
          <>
            <div className="d-flex flex-column px-2">{data.source}</div>
            <div className="d-flex flex-column">{data.text}</div>
          </>
        )}
      </div>
    </>
  );
};

export default FactPage;
