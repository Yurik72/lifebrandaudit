import axios, { AxiosHeaders }  from "axios";
import {useGenericQuery,useUpdatableGenericQuery,useGenericMutateUpdate,getHeaders} from './basequery.ts'
import { GlobalStateContext} from '../services/globalstate.tsx'
import React, { useState, useEffect,useContext } from "react";
const CONSUMER_QUERY='consumer'

const getHeaders1= ()=>{

  const headers={}
  headers['Ocp-Apim-Subscription-Key']='b98a2ffde7864380846ab6fb34e435e4'
  headers['Access-Control-Allow-Origin']= '*'
  headers['X_ASA_version']=1.07
  //headers['asaConsumerCode']=1729207976
  //headers['Content-Type']='application/json'
  headers['Accept']='application/json'
  return headers
}

const getConsumer =async (asaConsumerCode)=>{
  
  const headers=getHeaders()
  headers.AsaConsumerCode=asaConsumerCode
  
  const { data } = await axios.get(
    "https://asaconnectdev.asacore.com/asaconnect/Consumer/",
    {
      headers  :{...headers},
    }
    
  )
  console.log(data)
  return data;
}


function useConsumer() {
  const [state]=useContext(GlobalStateContext)
  const {asaConsumerCode}=state
  
  //return useGenericQuery([CONSUMER_QUERY,asaConsumerCode],async ()=>await getConsumer(asaConsumerCode))
  return useGenericQuery([CONSUMER_QUERY,asaConsumerCode],'Consumer')
}

export {useConsumer}