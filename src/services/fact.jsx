import React, { useEffect } from 'react';

import axios from "axios";
import { QueryClient, skipToken, useQuery, useQueryClient,useMutation } from "@tanstack/react-query";
import {useDataLoader} from './dataloader'
import {useGenericQuery,useUpdatableGenericQuery,useGenericMutateUpdate} from './basequery.ts'
 
const FACTS_QUERY='facts'
function useFacts() {
  return useGenericQuery([FACTS_QUERY],async () => {
    const { data } = await axios.get(
      "https://uselessfacts.jsph.pl/random.json",
    );
    console.log("call facts generic");
    return data;
  },)
}
function useFacts1() {
  const query= useQuery({
    queryKey: [FACTS_QUERY],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://uselessfacts.jsph.pl/random.json",
      );
      console.log("call facts");
      return data;
    },
    refetchOnWindowFocus: false,
  });
  const [setLoading,setError]=useDataLoader();
  //console.log(setLoading,setError,x,query.isFetching)
  useEffect(() => {
    setLoading(query.isFetching)  
  },[query.isFetching]);
 
  return query
}
function useUpdatableFacts(){
  const facts=useFacts()
  const doUpdate = async (f)=>{
    console.log("updating ",f)
    //var res =await fetch('https://testtest.com')
    
    return f;
  }
  const queryFn= async () => {
    const { data } = await axios.get(
      "https://uselessfacts.jsph.pl/random.json",
    );
    console.log("call facts");
    return data;
  }
  const updatable=useUpdatableGenericQuery([FACTS_QUERY],queryFn,doUpdate)
  return {...facts,update:updatable.update}
}
function useUpdatableFacts1(){
  const facts=useFacts()
  const doUpdate = async (f)=>{
    console.log("updating ",f)
    //var res =await fetch('https://testtest.com')
    
    return f;
  }
  const updatable=useGenericMutateUpdate(doUpdate,[FACTS_QUERY])
  return {...facts,update:updatable.update}
}

const useGenericMutateUpdate1 = (updatefn,keys)=>{
  const queryClient = useQueryClient()
  const  { status, error, mutate}  = 
    useMutation({
                    mutationFn: updatefn ,
                    onError: (err) => console.log("The error",err),
                    onSuccess:(data)=>{
                        queryClient.setQueryData(keys,{... data})
                        console.log("The data being returned",data)
                    }
                  })
  return {update:mutate}
}
const useUpdateFact=  ()=>{
  const doUpdate = async (f)=>{
    console.log("updating ",f)
    var res =await fetch('https://testtest.com')
    
    return f;
  }
  const queryClient = useQueryClient()
  const  { status, error, mutate,mutateAsync }  = 
    useMutation(
  {
     mutationFn: doUpdate ,
      onError: (err) => console.log("The error",err),
      onSuccess:(data)=>{
        queryClient.setQueryData(["facts"],{... data})
        console.log("The data being returned",data)
      }
  }
)
 
   return {mutate}
}

export { useFacts,useUpdateFact,useUpdatableFacts }
