import 'react-tabs/style/react-tabs.css';

import axios, { AxiosHeaders }  from "axios";
import {getHeaders} from '../services/basequery.ts'
import { GlobalStateContext} from '../services/globalstate.tsx'
import React, { useState, useEffect,useContext, Dispatch } from "react";
import Config from '../config.tsx';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';


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
    
    parameterValue:any
}
interface IVerificationOptionResponse extends IVerificationOption{
    isRequired:boolean,
    isMatched:boolean
}
interface IVerificationResponse {
    email:string
    phoneNumber:string
    verificationOptions:IVerificationOptionResponse[]

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
    debugEmail:string
    debugPhone:string
}
enum AuthStateEnum{
    AccountSelection,
    AccountConfirmation,
    NoAccount,
    AccountConfirmed

} 
interface IAuthState{
    lastStep:number,
    ErrorCode:String,
    isError:Boolean,
    lastResponse:IAsaResponse<IVerificationResponse> | undefined,
    currentstep:number,
    enters:Object
    authstate:AuthStateEnum,
    isCodeSent:boolean
}


const AuthState: IAuthState={
    lastStep:0,
    ErrorCode:'',
    isError:false,
    lastResponse:undefined,
    currentstep:0,
    enters:{},
    authstate:AuthStateEnum.AccountSelection,
    isCodeSent:false
}
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }
function groupBy(xs:[], key:string) {
    return xs.reduce((rv, x) =>{
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, []).reduce((rv,x)=>{
        if(x) rv.push(x)
        return rv
    },[]); 
    //{} if we need dictionary
};
const renderConfirmation=(email:string,phone:string)=>
    <Container>
        <Row className="align-items-center">
            <Col xs={12} md={3}>
            <Form.Label>Email</Form.Label>
            </Col>
            <Col xs={12} md={9}>
            <Form.Control
                type="text"
                value={email}
                readOnly={true}
            />
            </Col>
        </Row>
        <Row className="align-items-center">
            <Col xs={12} md={3}>
            <Form.Label>Phone</Form.Label>
            </Col>
            <Col xs={12} md={9}>
            <Form.Control
                type="text"
                value={phone}
                readOnly={true}
            />
            </Col>
        </Row>
    </Container>
const renderConfirmationCode=(enteredVars,setenteredVars,sendRequest)=>{
    const setOptionValue=(val)=>{
        setenteredVars({...enteredVars,EmailVerificationCode:val,PhoneVerificationCode:val})
    }
    console.log(enteredVars)
return(
    <Container>
        <Row className="align-items-center">
            <Col xs={12} md={3}>
            <Form.Label>Verification Code</Form.Label>
            </Col>
            <Col xs={12} md={9}>
            <Form.Control
                type="text"
                value={enteredVars.EmailVerificationCode}
                onChange={(e)=>setOptionValue(e.target.value)}
            />
            </Col>
        </Row>
        <Row>
            <Button className='bg-primary'  onClick={async(e)=>await sendRequest([])}>Send code</Button>
        </Row>
    </Container>    
    )
}
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
                {isIterable(options) && options.map((o)=>{
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
            debugEmail:'yurik.kovalenko@gmail.com',
            debugPhone:'+380503121075',
            verificationOptions:vars
        }
    }
    const getCurrentOption=()=>{
        return dfltVars[authState.currentstep]
    }
    const sendConfirmationCodeRequest=async ()=>{
        const requestCodeParam:IVerificationParam[]=[
            {parameterName:'EmailVerificationCode',parameterValue:'request'},
            {parameterName:'PhoneVerificationCode',parameterValue:'request'}
        ]
        await sendRequest(requestCodeParam)
        setauthState({...authState,isCodeSent:true,currentstep:dfltVars.length})
    }
    const skip=()=>{
        setauthState({...authState,currentstep:authState.currentstep+1})
    }
    const forward=async ()=>{
        await sendRequest([])
    }
    const  sendRequest=async (extraParams:IVerificationParam[]  )=>{
        try
            {
            setisLoad(true)
            const params=[...dfltVars.slice(0,authState.currentstep+1).flat().map((o)=>{
                return {parameterName:o.parameterName,parameterValue:enteredVars[o.parameterName]}
            }),...extraParams]
            
            var response=await postAuthenticate(asaConsumerCode,makePostData(params))
            console.log(response)
            setauthState({...authState,lastResponse:response,
                ErrorCode:response.data.errorCode,
                isError:response.status!=200,
                currentstep:authState.currentstep+1,
                authstate:AuthStateEnum[response.data.authenticationStep] 
            })
        }
        catch(err)
        {
            console.log(err)
        }
        finally{
            setisLoad(false)
        }
    }
    const back=()=>{
        setauthState({...authState,currentstep:authState.currentstep-1})
    }
    const renderNextInput=()=>{
        console.log('renderNextInput',authState.authstate,AuthStateEnum.AccountConfirmation)
        if (!authState.authstate || authState.authstate===AuthStateEnum.AccountSelection){
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
        else if(authState.authstate==AuthStateEnum.AccountConfirmation){
           if(authState.isCodeSent)
           {
            return(
                <>
                {renderConfirmationCode(enteredVars,setenteredVars,sendRequest)}
                <div className='d-flex justify-content-between p-3 bg-light'>
                    <input className='btn btn-info' type='button' value='ReSend Code' onClick={sendConfirmationCodeRequest}  />

                </div>                
                </>
            )
           }
           else{
            return(
                <>
                {renderConfirmation(authState.lastResponse.data.email,authState.lastResponse.data.phoneNumber)}
                <div className='d-flex justify-content-between p-3 bg-light'>
                    <input className='btn btn-info' type='button' value='Send Code' onClick={sendConfirmationCodeRequest}  />

                </div>                
                </>
            )
        }
        }
        
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
    <Container>
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
    <Accordion defaultActiveKey="-1">
      <Accordion.Item eventKey="0">
            <Accordion.Header>Entered details</Accordion.Header>
            <Accordion.Body>
                <Container>
                {authState.lastResponse && 
                    authState.lastResponse.data.verificationOptions.map((p)=>{
                        return(
                            <Row className={p.isMatched?'bg-success':'bg-danger'}>
                                <Col>
                                    {p.parameterName}
                                </Col>
                                <Col className='col'>
                                    {p.parameterValue}
                                </Col>
                            </Row>
                        )
                    })
                }
                </Container>
            </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
    )
}

export default AltAuth

