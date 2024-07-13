import 'react-tabs/style/react-tabs.css';

import axios, { AxiosHeaders }  from "axios";
import {getHeaders} from '../services/basequery.ts'
import { GlobalStateContext} from '../services/globalstate.tsx'
import React, { useState, useEffect,useContext, Dispatch } from "react";
import Config from '../config.tsx';
import { Container, Row, Col, Form } from 'react-bootstrap';

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
    isChanged:boolean
    isMatched:boolean
    isRequired:boolean

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
    lastResponse:IAsaResponse<IVerificationOptionResponse> | undefined,
    currentstep:number,
    enters:Object
    authstate:AuthStateEnum
}

const AuthState:IAuthState={
    lastStep:0,
    ErrorCode:'',
    isError:false,
    lastResponse:undefined,
    currentstep:0,
    enters:{},
    authstate:AuthStateEnum.AccountSelection
}

var groupBy = function(xs, key) {
    return xs.reduce((rv, x) =>{
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, []).reduce((rv,x)=>{
        if(x) rv.push(x)
        return rv
    },[]); 
    //{} if we need dictionary
};

const renderOptions=(options:IVerificationParam[],enteredVars,setenteredVars)=>{
    //console.log('render options',options)
    const setOptionValue=(optionname,val)=>{
        var cloned={...enteredVars}
        cloned[optionname]=val
        setenteredVars(cloned)
    }
    const getOptionValue=(optionname)=>{
        return enteredVars[optionname]
    }
    return(
        <>
         <div>
                {options.map((o)=>{
                    return(
                        <Container key={o.parameterName} className="mt-5">
                        <Row className="parameter-container">
                          <Col className="parameter-description">
                            {o.parameterDescription}
                          </Col>
                        </Row>
                        <Row className="align-items-center">
                          <Col xs={12} md={3}>
                            <Form.Label>{o.parameterName}</Form.Label>
                          </Col>
                          <Col xs={12} md={9}>
                            <Form.Control
                              type="text"
                              value={getOptionValue(o.parameterName)}
                              onChange={(e) => setOptionValue(o.parameterName, e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Container>
                    )
                }
                )
                }
            </div>
        </>
    )
}

const postAuthenticate =async (asaConsumerCode,postData)=>{
  
    const headers=getHeaders()
    headers.AsaConsumerCode=asaConsumerCode
    const { data } = await axios.post(
       `${Config.SERVER_URL}Consumer/AuthenticateConsumer` ,
       postData,
      {
        headers  :{...headers},
      }
      
    )
   
    return data;
  }


const  AltAuth=() =>{
    const asaFiCode=123456
    const [state]=useContext(GlobalStateContext)
    const {asaConsumerCode}=state
    const [authState,setauthState]=useState(AuthState)
    const [dfltVars,setdfltVars]:[IVerificationParam[][],React.Dispatch<React.SetStateAction<IVerificationParam[][]>>]=useState<IVerificationParam[][]>([])
    const [enteredVars,setenteredVars]=useState({})
    const [isLoad,setisLoad]:[boolean,React.Dispatch<React.SetStateAction<boolean>>]=useState<boolean>(false)
    console.log('authState',authState)
    function makePostData(vars:IVerificationOption[]):IPostData{
        return {
            asaFiCode:asaFiCode,
            asaConsumerCode:asaConsumerCode,
            authenticateRealtime:true,
            verificationOptions:vars
        }
    }
    const getCurrentOption=()=>{
        return dfltVars[authState.currentstep]
    }
    const skip=()=>{
        setauthState({...authState,currentstep:authState.currentstep+1})
    }
    const  forward=async ()=>{
        const params=dfltVars.slice(0,authState.currentstep+1).flat().map((o)=>{
            return {parameterName:o.parameterName,parameterValue:enteredVars[o.parameterName]}
        })
        setisLoad(true)
        var response=await postAuthenticate(asaConsumerCode,makePostData(params))
        console.log(response)
        setauthState({...authState,lastResponse:response,
            ErrorCode:response.data.errorCode,
            isError:response.status!=200,
            currentstep:authState.currentstep+1,
            authstate:response.data.authenticationStep as unknown as AuthStateEnum || AuthStateEnum.AccountSelection
        })
        setisLoad(false)
    }
    const back=()=>{
        setauthState({...authState,currentstep:authState.currentstep-1})
    }
    const renderNextInput=()=>{
        return (
            <>
            {renderOptions(getCurrentOption(),enteredVars,setenteredVars)}
            <div className='d-flex justify-content-between p-3 bg-light'>
                <input className='btn btn-primary' type='button' value="prev" onClick={back} disabled={authState.currentstep===0} />
                <input className='btn btn-primary' type='button' value="next"  onClick={forward} disabled={authState.currentstep>=(dfltVars.length-1)}/>

            </div>
            <div className='d-flex justify-content-between p-3 bg-light'>
                <input className='btn btn-secondary' type='button' value="skip" onClick={skip}  disabled={authState.currentstep>=(dfltVars.length-1)}/>
            </div>
            </>
        )
    }
    useEffect(() => {
        async function fetchData() {
            // You can await here
            setisLoad(true)
            const data =await postAuthenticate(asaConsumerCode,makePostData([]))
            console.log(data)
            if(data.status!=200){
                setauthState({...authState,isError:true,ErrorCode:data.data.errorCode,lastResponse:data})
            }
            else{
                setauthState({...authState,isError:false,ErrorCode:'',lastResponse:data})
                const sorted=data.data.verificationOptions.sort((a,b)=>a.verificationStep-b.verificationStep)
                const grouped=groupBy(sorted,'verificationStep')
                setdfltVars(grouped)
            }
            setisLoad(false)
          }
       fetchData();
       
      },[]);
      
    if(isLoad){
        return (
            <>
            <h2>Alternative Authentication</h2>
            <div className='bg-warning'>
                 Loading
            </div>
            </>
        )
    }
    return (
    <>
        <h2>Alternative Authentication</h2>
        {authState.isError && 
            <div>
                Error happens {authState.ErrorCode}
            </div>
        }
        {authState.lastResponse &&
            <>
            <div>
                 Message {authState.lastResponse.message}
            </div>

            </>
        }
        { dfltVars && dfltVars.length>0 &&
            <div>
                {
                renderNextInput()
                }
            </div>
        }
    </>
    )
}

export default AltAuth

