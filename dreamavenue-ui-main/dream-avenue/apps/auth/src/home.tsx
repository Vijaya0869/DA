import React from 'react';
import { useToaster } from 'container/components';
import {useMsalAuth} from 'container/auth';
import { useDataService } from 'container/useDataService';

const HomePage = () => {
    const {showToast} = useToaster();
const { login, logout, account  } = useMsalAuth();


const { updateDataRedux,getDataRedux } = useDataService();
 
  const userDetails = getDataRedux("userInfo");

  setTimeout(() => {
    updateDataRedux('userInfo',{'name':'Welcome to the HomePage'})
  }, 3000);
   
  return <div> <h1>Home Page</h1>
  <button onClick={()=>{
 showToast('This is an info toast', 'info');
  }}>toaster</button>
  <div>
      <h1>MSAL Authentication {userDetails?.name}</h1>
      {account ? (
        <>
          <p>Welcome, {account.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
   </div>;
};

export default HomePage;
