
import React, { useEffect,useContext } from 'react';
import axios from "axios";
import {UseQueryResult, QueryClient, skipToken, useQuery, useQueryClient,useMutation } from "@tanstack/react-query";
import {useDataLoader} from './dataloader'
import Config from '../config.tsx';
import { GlobalStateContext,IGlobalState} from '../services/globalstate.tsx'
//import { UseQueryResult } from 'react-query';

//types
type GetFunction=()=>any
type UpdateFunction=()=>any

interface AsaResponse<TData>{
    status:number,
    message:string,
    data:TData
}
interface BaseQueryResult<TData> {
    data: AsaResponse<TData>;
   
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

declare function GenericQueryFunc(keys:[key:string,val:any | undefined],query:GetFunction | string ):BaseQueryResult;
declare function GenericQueryFunc<TData>(keys:[key:string,val:any | undefined],query:GetFunction | string ):BaseQueryResult<TData>;
declare function GenericQueryFunc<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction ): BaseQueryResult;


declare function GenericUpdatableQueryFunc<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction,updatefn:UpdateFunction ): BaseUpdatableQueryResult;
declare function GenericMutateFunc<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],updatefn:UpdateFunction ): BaseMutateQueryResult;

declare function getHeadersFn():BaseHeaders
const getHeaders:typeof getHeadersFn = () =>{

    const headers:BaseHeaders=
    {
        'Ocp-Apim-Subscription-Key':Config.SUBSCRIPTION_KEY,
        'Access-Control-Allow-Origin': '*',
        'X_ASA_version':1.07,
        'Accept':'application/json'
    }
    return headers
}
const baseGet =async (path:string,state:IGlobalState)=>{
  
    const headers=getHeaders()
   
    const {asaConsumerCode}=state
    headers.AsaConsumerCode=asaConsumerCode
    const { data } = await axios.get(
        `${Config.SERVER_URL}${path}`,
      {
        headers  :{...headers},
      }
      
    )
    console.log(data)
    return data;
}
function useGenericQuery<TData>(keys:[key:string,val:any | undefined],query:GetFunction | string ): UseQueryResult<TData,any> {
    const [state]:[IGlobalState]=useContext(GlobalStateContext)
    const queryfn= (typeof query =='string')?()=>baseGet(query,state):query
    const reactquery= useQuery<BaseQueryResult<TData>,any>({
        queryKey: keys,
        queryFn: async () => {
            return await queryfn();
        },
        
        refetchOnWindowFocus: false,
        //refetchOnMount:false
      });
    
    const [setLoading,setError]=useDataLoader();
    //console.log(setLoading,setError,x,query.isFetching)
    useEffect(() => {
      setLoading(reactquery.isFetching)  
      setError(reactquery.isError)
    },[reactquery.isFetching]);
    if(reactquery.isError){
        console.log(reactquery.error)
    }
    return reactquery
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