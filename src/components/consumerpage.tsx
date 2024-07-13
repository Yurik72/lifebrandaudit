import React, { useState, useEffect,useContext } from "react";
import { useConsumer } from "../services/consumer.tsx";
import DataLoader from "./dataloader";
import ConsumerAccount from "./consumeraccounts.tsx";
import ConsumerAccountStatus from "./consumeraccountsstatus.tsx";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AllProps from "./allprops.tsx";
import { GlobalStateProvider,GlobalStateContext} from '../services/globalstate.tsx'
import PaymentMethods from "./paymentmethods.tsx"
import VirtualNotification from "./virtualnotificationpage.tsx";
import AltAuth from "./altauth.tsx";
const renderConsumerData=(data)=>{
  if (!data)
    return

  return(
    <>
    
    <Tabs>
    <TabList>
      <Tab>All props</Tab>
      <Tab>Accounts</Tab>
      <Tab>Status</Tab>
      <Tab>Payment</Tab>
      <Tab>Virtual Notification</Tab>
      <Tab>Alternate Authentication</Tab>
    </TabList>
   
    <TabPanel>
    <div>
      <AllProps src={data.data}/>
    </div>
    </TabPanel>
    <TabPanel>
      <ConsumerAccount accounts={data.data.consumerFiAccountDetails}/>
    </TabPanel>
    <TabPanel>
      <ConsumerAccountStatus accounts={data.data.fiAccountStatus}/>
    </TabPanel>
    <TabPanel>
      <PaymentMethods />
    </TabPanel>
    <TabPanel>
      <VirtualNotification />
    </TabPanel>
    <TabPanel>
      <AltAuth />
    </TabPanel>
 </Tabs>
    </>
  )
}
const ConsumerPage=()=>{
  const {data} = useConsumer();
  const [state, setState]=useContext(GlobalStateContext)
 
    return (
        <>
          <h2 className="due-font-service  text-center poppins-thin mt-10 mb-4">
            Consumer Page <input value={state.asaConsumerCode}  
              onChange={(e)=>setState({...state, asaConsumerCode:e.target.value})} />
             <span>{state.asaConsumerCode}</span>
          </h2>
          
          <div className="flex flex-col">
            {renderConsumerData(data)}
          </div>
        </>
    )
}
export default ConsumerPage