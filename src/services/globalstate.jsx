import React, { useState } from 'react';
 

const initialData={asaConsumerCode:1729207976,Token:''}
const GlobalStateContext = React.createContext();
 
const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState(initialData);
 
  return (
    <GlobalStateContext.Provider value={[state, setState]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateProvider,GlobalStateContext}