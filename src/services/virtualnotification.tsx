import axios, { AxiosHeaders }  from "axios";
import {useGenericQuery,useUpdatableGenericQuery,useGenericMutateUpdate,getHeaders} from './basequery.ts'
import { GlobalStateContext} from './globalstate.tsx'
import React, { useState, useEffect,useContext } from "react";
const VN_QUERY='virtualnotification'

interface VirtualNotificationData{
  totalCount:number,
  [propName: string]: any;
}


function useVirtualNotification() {
  const [state]=useContext(GlobalStateContext)
  const {asaConsumerCode}=state
  
  return useGenericQuery<VirtualNotificationData>([VN_QUERY,asaConsumerCode],'VirtualNotification')
  
}

export {useVirtualNotification}