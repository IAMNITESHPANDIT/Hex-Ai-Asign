import React from "react";

interface Iprops {
  msg: string;
}
const Nodata: React.FC<Iprops> = ({ msg }) => {
  return <div>{msg}</div>;
};

export default Nodata;
