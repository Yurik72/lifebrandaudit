interface IAsaResponse<TData>{
    message:string
    status:number
    version:string
    data:TData
}
interface  IVerificationParam{
    parameterName:string
    parameterDescription:string

} 

interface  IVerificationOption extends IVerificationParam{
    parameterName:string
    parameterValue:any
}
interface IVerificationOptionResponse extends IVerificationOption{
    isRequired:boolean,
    isMatched:boolean
}
interface IVerificationResponse {
    email:string
    phoneNumber:string

}
interface IAutheticateData{
    asaConsumerCode:number
    asaFiCode:number
    authenticationStep:string
    errorCode:string
    errorMessage:string
    email:string
    phoneNumber:string
    verificationOptions:IVerificationOptionResponse[]
}

interface IPostData{
    asaFiCode:Number
    asaConsumerCode:Number
    authenticateRealtime:Boolean
    verificationOptions:IVerificationOption[]
}
enum AuthStateEnum{
    AccountSelection,
    AccountConfirmation,
    NoAccount,

} 
interface IAuthState{
    lastStep:number,
    ErrorCode:String,
    isError:Boolean,
    lastResponse:IAsaResponse<IVerificationResponse> | undefined,
    currentstep:number,
    enters:Object
    authstate:AuthStateEnum
}
