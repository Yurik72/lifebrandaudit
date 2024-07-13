import 'react-tabs/style/react-tabs.css';

import axios, { AxiosHeaders }  from "axios";
import {getHeaders} from '../services/basequery.ts'
import { GlobalStateContext} from '../services/globalstate.tsx'
import React, { useState, useEffect,useContext } from "react";
import Config from '../config.tsx';


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
const renderOptions=(options,enteredVars,setenteredVars)=>{
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
                    <>
                        <div className='d-flex flex-row'>
                             {o.parameterDescription}
                        </div>
                        <div className='d-flex flex-column'>
                            
                            <div className='d-flex flex-row'>{o.parameterName}</div>
                            <div className='d-flex flex-row'>
                                <input val={getOptionValue(o.parameterName)}
                                onChange={(e)=>setOptionValue(o.parameterName,e.target.val)}/>
                            </div>
                            
                        </div>
                    </>
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
interface  IVerificationOption{
    parameterName:String
    parameterValue:any
} 
interface IPostData{
    asaFiCode:Number
    asaConsumerCode:Number
    authenticateRealtime:Boolean
    verificationOptions:IVerificationOption[]
}
const AuthState={
    lastStep:0,
    ErrorCode:'',
    isError:false,
    lastResponse:{},
    currentstep:0,
    enters:{}
}
function makePostData(asaFiCode:Number,asaConsumerCode:Number,vars:Object):IPostData{
    const options= Object.keys(vars).map((key) => { return {parameterName:key,parameterValue: vars[key] }})
    return {
        asaFiCode:asaFiCode,
        asaConsumerCode:asaConsumerCode,
        authenticateRealtime:true,
        verificationOptions:options
    }
}
const  AltAuth=() =>{
    const asaFiCode=123456
    const [state]=useContext(GlobalStateContext)
    const {asaConsumerCode}=state
    const [authState,setauthState]=useState(AuthState)
    const [dfltVars,setdfltVars]=useState([])
    const [enteredVars,setenteredVars]=useState({})
    const [isLoad,setisLoad]=useState(false)
    const getNextOption=()=>{
        return dfltVars[authState.currentstep]
    }
    const forward=()=>{
        setauthState({...authState,lastEnteredIdx:authState.currentstep+1})
    }
    const back=()=>{
        setauthState({...authState,lastEnteredIdx:authState.currentstep-1})
    }
    const renderNextInput=()=>{
        return (
            <>
            {renderOptions(getNextOption(),enteredVars,setenteredVars)}
            <div>
                <input type='button' value="prev" onClick={back} />
                <input type='button' value="next"  onClick={forward} />
                <input type='button' value="skip"/>
            </div>
            </>
        )
    }
    useEffect(() => {
        async function fetchData() {
            // You can await here
            setisLoad(true)
            const data =await postAuthenticate(asaConsumerCode,makePostData(asaFiCode,asaConsumerCode,enteredVars))
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
            <div>
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
            <>
            <div>
                Next Option 
            </div>
            <div>
                {
                renderNextInput()
                }
            </div>
            </>
        }
    </>
    )
}
//{data && data.data.consumerFintechMessagesWithFinTechDataViewModels.map(p=> <div> {p.paymentMethodName}</div>) }
export default AltAuth

