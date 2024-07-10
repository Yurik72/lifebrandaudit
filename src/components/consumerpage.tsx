import React, { useState, useEffect,useContext } from "react";
import { useConsumer } from "../services/consumer.tsx";
import DataLoader from "./dataloader";
import ConsumerAccount from "./consumeraccounts.tsx";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AllProps from "./allprops.tsx";
const renderConsumerData=(data)=>{
  if (!data)
    return

  return(
    <>

    <Tabs>
    <TabList>
      <Tab>All props</Tab>
      <Tab>Accounts</Tab>
    </TabList>
   
    <TabPanel>
    <div>
      <AllProps src={data.data}/>
    </div>
    </TabPanel>
    <TabPanel>
    <div>
    
      <ConsumerAccount accounts={data.data.consumerFiAccountDetails}/>
    </div>
    </TabPanel>
 </Tabs>
    </>
  )
}
const ConsumerPage=()=>{
  const {data} = useConsumer();
    return (
        <>
          <h2 className="due-font-service  text-center poppins-thin mt-10 mb-4">
            Consumer Page Header
          </h2>
          
          <div className="flex flex-col">
            {renderConsumerData(data)}
          </div>
        </>
    )
}
export default ConsumerPage