import React, { useEffect, useState } from 'react';
import './App.css';
import config from './config';   // import the config object

function App() {
  const [successMessage, setSuccessMessage] = useState(); 
  const [failureMessage, setFailureMessage] = useState(); 

  useEffect(() => {
    const getId = async () => {
      try {
        const resp = await fetch(config.backendUrl);
        const data = await resp.json();
        setSuccessMessage(data.id);
      }
      catch(e) {
        setFailureMessage(e.message);
      }
    };
    getId();
  }, []); // only run once when component mounts

  return (
    <div className="App">
      {!failureMessage && !successMessage ? 'Fetching...' : null}
      {failureMessage ? `Error: ${failureMessage}` : null}
      {successMessage ? `SUCCESS: ${successMessage}` : null}
    </div>
  );
}

export default App;
