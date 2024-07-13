import React, { useState } from 'react';
 
interface IGlobalState{
  asaConsumerCode:number,
  token:string
}

const initialData:IGlobalState={asaConsumerCode:1559428920,token:''}  //1559428920  //1729207976
const GlobalStateContext = React.createContext();
 
const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState(initialData);
 
  return (
    <GlobalStateContext.Provider value={[state, setState]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateProvider,GlobalStateContext,IGlobalState}