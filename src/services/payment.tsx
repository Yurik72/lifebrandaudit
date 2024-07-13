import axios, { AxiosHeaders }  from "axios";
import {useGenericQuery,useUpdatableGenericQuery,useGenericMutateUpdate,getHeaders} from './basequery.ts'
import { GlobalStateContext} from './globalstate.tsx'
import React, { useState, useEffect,useContext } from "react";
const PAYMENTMETHODS_QUERY='paymethods'

const getPaymentMethods =async (asaConsumerCode)=>{
  
  const headers=getHeaders()
  headers.AsaConsumerCode=asaConsumerCode
  
  const { data } = await axios.get(
    "https://asaconnectdev.asacore.com/asaconnect/Payment/PaymentMethod",
    {
      headers  :{...headers},
    }
    
  )
  console.log(data)
  return data;
}


function usePaymentMethods() {
  const [state]=useContext(GlobalStateContext)
  const {asaConsumerCode}=state
  
  return useGenericQuery([PAYMENTMETHODS_QUERY,asaConsumerCode],async ()=>await getPaymentMethods(asaConsumerCode))
  
}

export {usePaymentMethods}