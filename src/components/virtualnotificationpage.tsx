import 'react-tabs/style/react-tabs.css';
import React from "react";
import {useVirtualNotification} from "../services/virtualnotification.tsx"

const  VirtualNotification=() =>{
    const {data} = useVirtualNotification();
    console.log('VirtualNotification',data)
    return (
    <>
        <h2>Virtual notification</h2>
        { data && data.data &&
        <div>
         <span>Total count :{data.data.totalCount}</span> 
        </div>
        }
    </>
    )
}
//{data && data.data.consumerFintechMessagesWithFinTechDataViewModels.map(p=> <div> {p.paymentMethodName}</div>) }
export default VirtualNotification

