import React from "react";



import FinalResult from "./components/finalresult";
import Payment from "./components/payment";
import FactPage from "./components/factpage";
import {  QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { GlobalStateProvider,GlobalStateContext} from './services/globalstate'
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
const persister = createSyncStoragePersister({
    storage: window.localStorage,
  })
const ReportContent = (launcher) => {
  //console.log(launcher);
  return <div>rendre</div>;
};

const App = () => {
  return (
    <>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <GlobalStateProvider>
        <div>
          <FactPage />
          <Payment test="23213" child={ReportContent}>
            <div>Test</div>
          </Payment>
        </div>
        </GlobalStateProvider>
      </PersistQueryClientProvider>
    </>
  );
};

//ReactDOM.render(<App storage={store } />, document.getElementById('root'));
export default App;
