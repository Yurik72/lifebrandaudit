type GetFunction=()=>any
type UpdateFunction=()=>any
interface GenericQueryResult {
    data: any| undefined;
   
    isError?: boolean;
  
    isLoading: boolean;
    isLoadingError?: boolean;
    isRefetchError?: boolean;
    isSuccess?: boolean;
    status?: string;
    [propName: string]: any;
}
interface GenericUpdatableQueryResult extends GenericQueryResult{
    update:UpdateFunction
}


//type UseGenericQuery=(keys:[key:string,val:any | undefined],queryfn:GetFunction )=> GenericQueryResult;
//type UseGenericQuery<TKeyVal>=(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction )=> GenericQueryResult;
declare function UseGenericQuery(keys:[key:string,val:any | undefined],queryfn:GetFunction ):GenericQueryResult;
declare function UseGenericQuery<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction ): GenericQueryResult;

declare function UseGenericUpdatableQuery<TKeyVal>(keys:[key:string,val:TKeyVal | undefined],queryfn:GetFunction,updatefn:UpdateFunction ): GenericUpdatableQueryResult;

export { UseGenericQuery,GenericQueryResult,GenericUpdatableQueryResult,GetFunction,UseGenericUpdatableQuery,UpdateFunction };