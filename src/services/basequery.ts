
import React, { useEffect } from 'react';
import axios from "axios";
import { QueryClient, skipToken, useQuery, useQueryClient,useMutation } from "@tanstack/react-query";
import {useDataLoader} from './dataloader'
//types
type GetFunction=()=>any
type UpdateFunction=()=>any
interface BaseQueryResult {
    data: any| undefined;
   
    isError?: boolean;
  
    isLoading: boolean;
    isLoadingError?: boolean;
    isRefetchError?: boolean;
    isSuccess?: boolean;
    status?: string;
    [propName: string]: any;
}
interface BaseMutateQueryResult {
    update:UpdateFunction
}
interface BaseUpdatableQueryResult extends BaseQueryResult{
    update:UpdateFunction
}
interface BaseHeaders{
    'Ocp-Apim-Subscription-Key':string
    'Access-Control-Allow-Origin':string
    'X_ASA_version':number
    'Accept':string
    AsaConsumerCode?:number
}

declare function GenericQueryFunc(keys:[key:string,val:any | undefined],queryfn:GetFunction ):BaseQueryResult;
declare function GenericQueryFunc<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction ): BaseQueryResult;

declare function GenericUpdatableQueryFunc<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction,updatefn:UpdateFunction ): BaseUpdatableQueryResult;
declare function GenericMutateFunc<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],updatefn:UpdateFunction ): BaseMutateQueryResult;

declare function getHeadersFn():BaseHeaders
const getHeaders:typeof getHeadersFn = () =>{

    const headers:BaseHeaders=
    {
        'Ocp-Apim-Subscription-Key':'b98a2ffde7864380846ab6fb34e435e4',
        'Access-Control-Allow-Origin': '*',
        'X_ASA_version':1.07,
        'Accept':'application/json'
    }
    return headers
}
const useGenericQuery: typeof GenericQueryFunc =(keys,queryfn )=> {
    const query= useQuery({
        queryKey: keys,
        queryFn: async () => {
            return await queryfn();
        },
        
        refetchOnWindowFocus: false,
      });
    const result: BaseQueryResult = query;
    const [setLoading,setError]=useDataLoader();
    //console.log(setLoading,setError,x,query.isFetching)
    useEffect(() => {
      setLoading(query.isFetching)  
      setError(query.isError)
    },[query.isFetching]);
    if(query.isError){
        console.log(query.error)
    }
    return result
}

const useUpdatableGenericQuery: typeof GenericUpdatableQueryFunc =(keys,queryfn,updatefn)=>{
    const query=useGenericQuery(keys,queryfn)
    const updatable=useGenericMutateUpdate(keys,updatefn)

    const result: BaseUpdatableQueryResult ={... query,update:updatable.update};

    return result
}
const useGenericMutateUpdate:typeof GenericMutateFunc = (keys,updatefn)=>{
    const queryClient = useQueryClient()
    const  { status, error, mutate}  = 
      useMutation({
                      mutationFn: updatefn ,
                      onError: (err) => console.log("The error",err),
                      onSuccess:(data:object)=>{
                          queryClient.setQueryData(keys,{... data})
                          console.log("The data being returned",data)
                      }
                    })
    return {update:mutate}
}
export {useGenericQuery,useUpdatableGenericQuery,useGenericMutateUpdate,getHeaders}