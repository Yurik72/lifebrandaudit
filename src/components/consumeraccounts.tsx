import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import React from "react";
import AllProps from "./allprops.tsx";
const renderAccountDetail=(account)=>
    <>

        <img src={account.fiIcon}/>
        <div>Balance {account.balance}</div>
        <AllProps src={account}/>

    </>
const  ConsumerAccount=({accounts}) =>
    <>
   
  <Tabs>
  <TabList>
    {accounts.map(function(acc) {
      return (
        <Tab>{acc.fiAccountName}</Tab>
      )
    })}
    
    </TabList>
    {accounts.map(function(acc) {
      return (
        <TabPanel>
            {renderAccountDetail(acc) }
        </TabPanel>
      )
    })}

  </Tabs>


    </>
export default ConsumerAccount