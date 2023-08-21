import React, { useState } from "react";

export default function SimpleSelect() {
  const [status, setStatus] = useState("");

  const handleStatusChange = (e: any) => {
    console.log(e.target.value);
    setStatus(e.target.value);
  };

  return (
    <div>
      <h1>Simple Select</h1>
      <select value={status} onChange={handleStatusChange}>
        <option value="">Select a status</option>
        <option value="todo">todo</option>
        <option value="doing">doing</option>
        <option value="done">done</option>
      </select>
      <p>Selected Status: {status}</p>
    </div>
  );
}
