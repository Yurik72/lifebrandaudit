import React, { useState, useEffect } from "react";

const RentSection = ({ substype }) => {
  switch (substype) {
    case "Montly":
      return <div className="flex flex-col">Montly section</div>;
      break;
    case "Yearly":
      return <div className="flex flex-col">YerlySection</div>;
      break;
  }
};
const Payment = (props) => {
  const [substype, setsubstype] = useState("Montly");
  const { child } = props;
  const handlechangetype = () => {
    if (substype == "Montly") setsubstype("Yearly");
    else setsubstype("Montly");
  };
  //console.log(props);

  const launchPayment = (x) => {
    //console.log(x);
    return (
      <>
        <div>content</div>
      </>
    );
  };
  return (
    <>
      <h2 className=" due-font-service  text-center poppins-thin mt-10 mb-4  ">
        Improve my score -!
        {child()}
      </h2>

      <div className="flex flex-col" onClick={handlechangetype}>
        Change Type {substype}
      </div>
      <RentSection substype={substype} />
      <div className="flex flex-col">
        <div
          className=" p-3 px-4 rounded-xl w-[85%] mx-auto mb-4 custom-div "
          onClick={() => {}}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">{child(launchPayment)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
