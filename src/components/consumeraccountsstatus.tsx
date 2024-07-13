import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import React from "react";
import AllProps from "./allprops.tsx";
const renderAccountStatusDetail=(account)=>
    <>

        <img src={account.fiIcon}/>

        <AllProps src={account}/>

    </>
const  ConsumerAccountStatus=({accounts}) =>
    <>
    
  <Tabs>
   <TabList>
    {accounts.map(function(acc) {
      return (
        <Tab  key={acc.asaFiCode }>{acc.fiName}</Tab>
      )
    })}
    
    </TabList>
    {accounts.map(function(acc) {
      return (
        <TabPanel key={'panel'+acc.asaFiCode }>
            {renderAccountStatusDetail(acc) }
        </TabPanel>
      )
    })}

  </Tabs>
    </>
export default ConsumerAccountStatus