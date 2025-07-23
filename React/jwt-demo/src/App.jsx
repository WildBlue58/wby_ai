import { useState, useEffect } from 'react'
import { getUser } from './api/user'
import './App.css'

function App() {
  useEffect(() => {
    (async () => {
      const res = await getUser()
      console.log(res, "----res");
    })()
  }, []);
  
  return (
    <>
   
    </>
  )
}

export default App
