
import React, { useEffect, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './css/Login.css'
import deerHome from '../assets/deerHome.png'
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { app,auth } from '../components/firebase'
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
export default function Signup() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  let [email, setEmail] = useState()
  let [password, setPassword] = useState()
  let [displayName,setDisplayName]=useState('')
  let emailRef=useRef()
  let passwordRef=useRef()
  let displayNameRef=useRef()
  let navigate = useNavigate()
  
  

  let handleSignup = () => {

    console.log(emailRef.current.value)
    console.log(passwordRef.current.value)
    setEmail(emailRef.current.value)
    setPassword(passwordRef.current.value)
    setDisplayName(displayNameRef.current.value)
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user signned up',user)
        
        return updateProfile(user,{ displayName: displayName })
      })
      .then(()=>{
        console.log('profile updated')
        navigate('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      })
      
  }
  // useEffect(()=>{
  //   if(displayName.length > 0){
  //     updateProfile(auth.currentUser,{displayName:displayName}).then(response=> {
  //       console.log('profile updated')
  //     })
  //   }
    
  // },[auth,displayName])

  return (
    <div className="login-page">
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} >
            <Item style={{ boxShadow: 'none', backgroundColor: '#f15a24' }}>
              <img src={deerHome} style={{ height: '30rem' }} />
            </Item>
          </Grid>
          <Grid item xs={6} style={{ padding: '4rem' }}>
            <Item style={{ boxShadow: 'none', padding: '2rem', width: '100%', height: '100%', backgroundColor: '#f15a24' }}>

              <div className="login-form">
                <h1>Cinema Elk</h1>
                
                  <div className='inputDiv'>
                    <input type="text" placeholder="enter email" ref={emailRef} />
                    <input type="password" placeholder="enter password" ref={passwordRef} />
                  </div>
                  <input type="text" placeholder="enter username" style={{ width: '97%' }} ref={displayNameRef} />
                  <Button variant="outlined" className='login-btn' onClick={handleSignup}>Join the club</Button>
                
               
                <div style={{ color: 'white' }}>Already a member, <Link to='/login' style={{ color: 'white' }}>click here</Link> </div>
              </div>

            </Item>
          </Grid>

        </Grid>
      </Box>
    </div>
  )
}