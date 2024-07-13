import React, { useState,useContext } from 'react';
 


const DataLoaderContext = React.createContext();
const useDataLoader=()=>useContext(DataLoaderContext)
 
const DataLoaderProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  return (
    <DataLoaderContext.Provider value={[setLoading,setError]}>
    <>
      <div className={isLoading?'bg-warning':''}>
        Data Loader State {isLoading?'Loading':'Done'}
        {isError &&
          <div className='bg-danger'>
            Error
          </div>
        }
      </div>
      {children}
    </>
    </DataLoaderContext.Provider>
  );
};

export { DataLoaderProvider,useDataLoader}