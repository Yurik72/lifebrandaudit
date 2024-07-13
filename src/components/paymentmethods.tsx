import 'react-tabs/style/react-tabs.css';
import React from "react";
import {usePaymentMethods} from "../services/payment.tsx"

const  PaymentMethods=() =>{
    const {data} = usePaymentMethods();
  
    return (
    <>
        <h2>Payment methods</h2>
        {data && data.data.map(p=> <div> {p.paymentMethodName}</div>) }
    </>
    )
}
export default PaymentMethods