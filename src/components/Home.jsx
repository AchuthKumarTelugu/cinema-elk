
import './css/Home.css'

import { app } from './firebase'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import deerHome from '../assets/deerHome.png';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faFilm, faUserLarge } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';


export default function Home() {
    //nav bar
    let [userLoggedin, setUserLoggedin] = useState(false)
    let navigate = useNavigate()
    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                console.log('user logged in')
                setUserLoggedin(true)
            } else {
                console.log('user logged in ')
                navigate('/login')
            }
        });
    }, [])
    let handleLogout = () => {
        const auth = getAuth(app)
        signOut(auth).then(() => {
            console.log('successfully logged out')
            navigate('/login')
        }).catch((error) => {
            console.log(error.message)
        })
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    let [iconColors, setIconColors] = useState({
        icon1: '#5271ff',
        icon2: '#5271ff',
        icon3: '#5271ff'
    })
    let onIconClick = (iconName) => {
        // setIconColors({
        //     ...iconColors,
        //     [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff'
        // })

        if(iconName=='icon1') {
            setIconColors({
                [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff',icon2:'#5271ff',icon3:'#5271ff'
            })
        }
        else if (iconName=='icon2') {
            setIconColors({
                [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff',icon1:'#5271ff',icon3:'#5271ff'
            })
        }
        else if (iconName=='icon3') {
            setIconColors({
                [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff',icon1:'#5271ff',icon2:'#5271ff'
            })
        }
    }
    let handleHomeIconClick = () => {
        
        setIconColors({
            ...iconColors,icon2:'#5271ff',icon3:'#5271ff',icon1:iconColors.icon1=='#5271ff'?'#f15a24' : '#5271ff'
        })
        navigate('/')
    }
    //movie section
    let [nowPlayingMovies, setNowPlayingMovies] = useState([])
    let [popularMovies, setPopularMovies] = useState([])
    let [topRatedMovies, setTopRatedMovies] = useState([])
    let [upcomingMovies, setUpcomingMovies] = useState([])
    useEffect(() => {
        axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=c49d68720978f410e5623716625cbe43').then((response) => {
            console.log(response.data.results)
            setNowPlayingMovies(response.data.results)
            console.log('now playing ', nowPlayingMovies)
        })
        axios.get('https://api.themoviedb.org/3/movie/popular?api_key=c49d68720978f410e5623716625cbe43').then(response=>{
            setPopularMovies(response.data.results)
        })
        axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=c49d68720978f410e5623716625cbe43').then(response=>{
            setTopRatedMovies(response.data.results)
        })        
        axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key=c49d68720978f410e5623716625cbe43').then(response=>{
            setUpcomingMovies(response.data.results)
        })        

    }, [])
    let handleCardClick = (movie) => {
           navigate('/movieDetails',{state:movie})
    }
    return (
        <div>
            <div className='navbar'>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{ backgroundColor: '#f15a24' }}>
                        <Toolbar>
                            <img src={deerHome} style={{ height: '4rem' }} />
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Cinema Elk
                            </Typography>
                            {
                                userLoggedin == true ? <Button onClick={handleLogout} style={{ color: 'white' }}>Log out</Button> : <Button onClick={() => { navigate('/login') }} style={{ color: 'white' }}>Log in</Button>
                            }
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>
            <div className='mainSection'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} >

                        <Grid item xs={1} >
                            <Item className="item item1">
                                <div className='icon-list'>
                                    <FontAwesomeIcon icon={faHouse} style={{ backgroundColor: iconColors.icon1 }} className='icon' onClick={() => {
                                        // onIconClick('icon1')
                                        console.log('home icon')
                                        handleHomeIconClick()
                                        }} />
                                    <FontAwesomeIcon icon={faFilm} className='icon' style={{ backgroundColor: iconColors.icon2 }} onClick={() => {
                                        onIconClick('icon2')
                                        navigate('/allMoviesReviews')
                                        }} />
                                    <FontAwesomeIcon icon={faUserLarge} className='icon' style={{ backgroundColor: iconColors.icon3 }} onClick={() => 
                                        {
                                            onIconClick('icon3')
                                            navigate('/myReviews')
                                            }} />
                                </div>
                            </Item>
                        </Grid>
                        <Grid item xs={11}>
                            <Item className="item item2">
                                <div className=' movieList'>
                                    <h2 className=' movieList-heading'>Now playing :</h2>
                                    <div className=' movieList-movies'>
                                        {
                                            nowPlayingMovies.map((movie, index) => {
                                                return (
                                                    <Card sx={{ maxWidth: 345 }} key={index} className=' card' onClick={()=>{handleCardClick(movie)}}>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={`http://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                                                alt="green iguana"
                                                                
                                                            />
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h5" component="div" sx={{  }} className=' movieList-movieHeading'>
                                                                    {movie.title}
                                                                </Typography>

                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                
                                <div className=' movieList'>
                                    <h2 className=' movieList-heading'>Popular movies :</h2>
                                    <div className=' movieList-movies'>
                                        {
                                            popularMovies.map((movie, index) => {
                                                return (
                                                    <Card sx={{ maxWidth: 345 }} key={index} className=' card' onClick={()=>{handleCardClick(movie)}}>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={`http://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                                                alt="green iguana"
                                                                
                                                            />
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h5" component="div" sx={{  }} className=' movieList-movieHeading'>
                                                                    {movie.title}
                                                                </Typography>

                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                
                                <div className=' movieList'>
                                    <h2 className=' movieList-heading'>Top Rated movies :</h2>
                                    <div className=' movieList-movies'>
                                        {
                                            topRatedMovies.map((movie, index) => {
                                                return (
                                                    <Card sx={{ maxWidth: 345 }} key={index} className=' card' onClick={()=>{handleCardClick(movie)}}>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={`http://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                                                alt="green iguana"
                                                                
                                                            />
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h5" component="div" sx={{  }} className=' movieList-movieHeading'>
                                                                    {movie.title}
                                                                </Typography>

                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                
                                <div className=' movieList'>
                                    <h2 className=' movieList-heading'>Upcoming movies :</h2>
                                    <div className=' movieList-movies'>
                                        {
                                            upcomingMovies.map((movie, index) => {
                                                return (
                                                    <Card sx={{ maxWidth: 345 }} key={index} className=' card' onClick={()=>{handleCardClick(movie)}}>
                                                        <CardActionArea>
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={`http://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                                                alt="green iguana"
                                                                
                                                            />
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h5" component="div" sx={{  }} className=' movieList-movieHeading'>
                                                                    {movie.title}
                                                                </Typography>

                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    )
}