import * as React from "react";

import axios from "axios";
import { QueryClient, skipToken, useQuery, useQueryClient,useMutation } from "@tanstack/react-query";


function useFacts() {
  return useQuery({
    queryKey: ["facts"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://uselessfacts.jsph.pl/random.json",
      );
      console.log("call facts");
      return data;
    },
    refetchOnWindowFocus: false,
  });
}
const useUpdateFact=  ()=>{
  const doUpdate = async (f)=>{
    console.log("updating ",f)
    var res =await fetch('https://testtest.com')
    throw new Error('something terrible happened');
    return null;
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
 
 
  return {mutate,mutateAsync}
}

export { useFacts,useUpdateFact }
