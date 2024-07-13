import React  from "react";
const AllProps =({src})=>
    <div>
{
    Object.keys(src).map((key) => {
      return ( 
      <div key={key}>
     
      <div className="whiteSpaceNoWrap">
      <span className="whiteSpaceNoWrap">{key} : </span>
        {
          
          (typeof src[key]  === 'object' || src[key] == null)
          ?"---":src[key]
        }
        </div>
        </div>
        )
    })
}
</div>
export default AllProps