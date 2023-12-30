
import React, { useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './css/Login.css'
import deerHome from '../assets/deerHome.png'
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../components/firebase'
export default function Login() {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    let [email, setEmail] = useState()
    let [password, setPassword] = useState()
    let emailRef = useRef()
    let passwordRef = useRef()
    let navigate=useNavigate()

    let handleLogin = () => {
        console.log(emailRef.current.value)
        console.log(passwordRef.current.value)
        setEmail(emailRef.current.value)
        setPassword(passwordRef.current.value)

        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('user signed in')
                const user = userCredential.user;
                console.log(user)
                navigate('/')

            })
            .catch((error) => {
                console.log('user credentials are wrong!')
            });
    }

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

                                <Button onClick={handleLogin} variant="outlined" className='login-btn'>Login Now</Button>
                                <div style={{ color: 'white' }}>Join the club , <Link to='/signup' style={{ color: 'white' }}>click here</Link>  </div>
                            </div>

                        </Item>
                    </Grid>

                </Grid>
            </Box>
        </div>
    )
}