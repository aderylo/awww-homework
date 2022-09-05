import React from "react";
import "./Main.css";

function Error(props) {
  let error = props.error;
  return (
    <>
      <title>Wystąpił błąd</title>
      <div id="trips">
        <h1>Wystąpił błąd</h1>
        <p id="error_msg"> {error} </p>
      </div>
    </>
  );
}

export default Error;
