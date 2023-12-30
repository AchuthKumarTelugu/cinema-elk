

import './css/AllMoviesReviews.css'

import './css/Home.css'

import { app, db, auth } from './firebase'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, setDoc, addDoc, doc, getDoc, getDocs, query, where,deleteDoc } from "firebase/firestore";
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
import { faHouse, faFilm, faUserLarge, faStar,faTrash,faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function MyReviews() {

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
        icon3: '#f15a24'
    })
    let onIconClick = (iconName) => {
        // setIconColors({
        //     ...iconColors,
        //     [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff'
        // })

        if (iconName == 'icon1') {
            setIconColors({
                [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff', icon2: '#5271ff', icon3: '#5271ff'
            })
        }
        else if (iconName == 'icon2') {
            setIconColors({
                [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff', icon1: '#5271ff', icon3: '#5271ff'
            })
        }
        else if (iconName == 'icon3') {
            setIconColors({
                [iconName]: (iconColors[iconName] == '#5271ff') ? '#f15a24' : '#5271ff', icon1: '#5271ff', icon2: '#5271ff'
            })
        }
    }
    let handleHomeIconClick = () => {

        setIconColors({
            ...iconColors, icon2: '#5271ff', icon3: '#5271ff', icon1: iconColors.icon1 == '#5271ff' ? '#f15a24' : '#5271ff'
        })
        navigate('/')
    }
    //review part
    let [allReviews, setAllReviews] = useState([])

    
    let [appUser,setAppUser]=useState(getAuth(app).currentUser)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            if (user) {
                console.log('User logged in:', user);
                setAppUser(user);
            } else {
                console.log('No authenticated user');
                navigate('/login');
            }
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, []);  


    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = getAuth(app).currentUser;
    
                // Check if there is a current user
                if (user) {
                    const currentUser = user.displayName;
                    const collectionRef = collection(db, 'reviews');
                    const tempReviews = [];
    
                    console.log('user name', currentUser);
    
                    const userCollection = collection(doc(collectionRef, currentUser), 'userReviews');
                    const docs = await getDocs(userCollection);
                    docs.forEach((doc) => {
                        console.log('doc name:', doc.id);
                        tempReviews.push(doc.data());
                    });
    
                    console.log('tempReview', tempReviews);
                    setAllReviews(tempReviews);
                } else {
                    console.log('No authenticated user');
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
    
        fetchData();
      
        
    }, [appUser]);
    
    

    useEffect(() => {
        console.log('all reviews', allReviews);
    }, [allReviews])

    function getstarRating(num) {
        console.log('entered star rating')
        let n = Math.floor(num)
        let number = n <= 5 ? n : (n % 5 != 0 ? n % 5 : 5)
        let rating = []

        let unchecked = 5 - number
        for (let i = 0; i < number; i++) {
            rating.push(<FontAwesomeIcon icon={faStar} className='checked' style={{ color: 'gold' }} />)
        }
        for (let j = 0; j < unchecked; j++) {
            rating.push(<FontAwesomeIcon icon={faStar} className="unchecked" style={{ color: 'gray' }} />)
        }
        return rating
    }
    function handlePosterClick(movie) {
        navigate('/movieDetails', { state: movie })
    }
    let [popupStatus,setPopupStatus]=useState(true)
    let [popupContent,setPopupContent]=useState('this is pop up content')
     async function handleDeleteDocIcon(movieName) {
         let collectionRef=collection(db,'reviews')
         let userDoc=doc(collectionRef,appUser.displayName)
         let userReviewCollection=collection(userDoc,'userReviews')
         await deleteDoc(doc(userReviewCollection, movieName))
         console.log('successfully deleted')
         window.location.reload()  //this may cause error of dat lost
    }
    return (
        <div className="allMoviesReviews-section">
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
                    <Grid container spacing={1}>

                        <Grid item xs={1}>
                            <Item className='item item1'>
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
                                    <FontAwesomeIcon icon={faUserLarge} className='icon' style={{ backgroundColor: iconColors.icon3 }} onClick={() => {
                                        onIconClick('icon3')
                                        navigate('/myReviews')
                                    }} />
                                </div>

                            </Item>
                        </Grid>
                        <Grid item xs={11}>
                            <Item className='item item2' style={{padding:'2rem'}}>
                                <h2 style={{textAlign:'left'}}>My Reviews</h2>
                                <div className='allReviews'>
                                    {

                                        allReviews.map((movieObj, index) => {
                                            return <div className='reviewBox' key={index}>
                                                <div className="left">
                                                    <h2>{movieObj.userName}</h2>
                                                    <hr />
                                                    <p className='audienceComment'>
                                                        {movieObj.review}
                                                    </p>
                                                    <div className="starRating">
                                                        {
                                                            getstarRating(movieObj.rating).map((star, index) => {
                                                                return <span key={index} className='star'>{star}</span>
                                                            })
                                                        }
                                                    </div>
                                                    <div className="commentUpdateLogic">
                                                    <Button variant='contained' onClick={() => { handlePosterClick(movieObj.movieApi) }}>Read More</Button>
                                                    <FontAwesomeIcon icon={faPenToSquare} style={{color:'lightgreen'}} className='editIcon' onClick={() => { handlePosterClick(movieObj.movieApi) }} />
                                                    <FontAwesomeIcon icon={faTrash} style={{color:'red'}} className='editIcon' onClick={()=>{handleDeleteDocIcon(movieObj.movieTitle)}}/>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <img src={`http://image.tmdb.org/t/p/original/${movieObj.moviePath}`} onClick={() => { handlePosterClick(movieObj.movieApi) }} />
                                                </div>
                                            </div>
                                        })
                                    }

                                </div>

                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            {/* <div className='editPopup'>
                <textarea name="" id=""  value={popupContent}></textarea>
                <div className='inputRating'>
                    Rating <input type='number' style={{width:'4rem'}}/> out of 5
                </div>
                <Button variant='contained' className='editReview'>Edit Review</Button>
            </div> */}
        </div>
    )
}