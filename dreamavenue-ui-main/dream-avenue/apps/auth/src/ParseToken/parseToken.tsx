import React, { Component, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

type Props = {}

 
const ParseToken : React.FC = () => {
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem("authToken", token);
            window.location.href = "/property";
        }
      }, [searchParams]);
return (
    <div>
        <h1>Parse Token</h1>
    </div>
  
)
}

export default ParseToken