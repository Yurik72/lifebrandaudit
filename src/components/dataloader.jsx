import React, { useState, useEffect } from "react";
import { useFacts } from "../services/fact";
const DataLoader = ({ query }) => {
  const { status, data, error, isFetching } = query;

  return (
    <>
      <div className="flex flex-row">Status {status}</div>

      <div className="flex flex-row">
        IsFetching {isFetching ? "True" : "False"}
      </div>
    </>
  );
};

export default DataLoader;
