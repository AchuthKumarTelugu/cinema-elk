
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './css/MovieDetails.css'

import { app, db, auth } from './firebase'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, setDoc, addDoc, doc ,getDoc,getDocs,query,where} from "firebase/firestore";
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
import { faHouse, faFilm, faUserLarge ,faStar,faUser } from '@fortawesome/free-solid-svg-icons'

export default function MovieDetails() {
    let [userLoggedin, setUserLoggedin] = useState(false)
    let location = useLocation()
    let [movie, setMovie] = useState({})
    let [movieCrew, setMovieCrew] = useState([])
    let [similarMovies, setSimilarMovies] = useState([])
    let [presentReviews,setPresentReviews]=useState([])
    let [starRating,setStarRating]=useState(['check','check','check','uncheck','uncheck'])
    useEffect(() => {
        let tempMovie = location.state
        console.log(tempMovie)
        setMovie(tempMovie)
        console.log('movie', movie)
        if (tempMovie && tempMovie.id) {
            axios.get(`https://api.themoviedb.org/3/movie/${tempMovie.id}/credits?api_key=c49d68720978f410e5623716625cbe43`).then((response) => {
                console.log(response.data.cast)
                let tempCrew = response.data.cast
                if (tempCrew.length > 12) {
                    tempCrew = tempCrew.filter((data) => {
                        if (data.popularity > 10) {
                            return data
                        }
                    })
                }
                setMovieCrew(tempCrew)

            })
        }
        getAllReviews(tempMovie)

    }, [location.state])
   

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=c49d68720978f410e5623716625cbe43`).then((response) => {
            let tempMovies = response.data.results
            console.log(tempMovies)
            setSimilarMovies(response.data.results)
        })
    }, [movieCrew])

    //nav bar

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
                setUserLoggedin(false)
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
        icon1: '#f15a24',
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
            ...iconColors,icon2:'#5271ff',icon3:'#5271ff',icon1:iconColors.icon1=='#f15a24'? '#5271ff' : '#f15a24'
        })
        navigate('/')
    }
    let handleCardClick = (movie) => {
        navigate('/movieDetails', { state: movie })

    }
    let [reviewCardStatus, setReviewCardStatus] = useState({
        position: 'relative',
        opacity: false
    })
    let reviewContentRef = useRef()
    let reviewRatingRef = useRef()
    let handlePostReview = () => {
        setReviewCardStatus({ ...reviewCardStatus, position: reviewCardStatus.position == 'relative' ? 'absolute' : 'relative', opacity: reviewCardStatus.opacity == false ? true : false })
        reviewContentRef.value = ''
        reviewRatingRef.value = ''
    }
    let handleSubmitReview = () => {
        console.log(getAuth(app).currentUser.displayName)
        console.log(reviewContentRef.current.value)
        console.log(reviewRatingRef.current.value)
        console.log(movie.id, ' -> ', movie.title)
        let user = getAuth(app).currentUser.displayName
        let comment = reviewContentRef.current.value
        let rating = reviewRatingRef.current.value
        const collectionRef = collection(db, 'reviews')
        if (comment.length > 0) {
            console.log('entered loop1')
          
            let userRef = doc(collectionRef, user)
            let reviewCollection = collection(userRef, 'userReviews')
            setDoc(doc(reviewCollection, movie.title), {
                review: comment,
                rating: parseInt(rating),
                movieId: movie.id,
                movieTitle: movie.title
                , moviePath: movie.poster_path,
                userName:user,
                movieApi:movie
            }).then(() => {
                console.log('data added')
            })
        }
        handlePostReview()
        // window.location.reload()//this may cause data loss error
    }

    async function getAllReviews(movie){
        console.log('movie database ',movie)
        let collectionRef=collection(db,'reviews')
        let tempReviews=[]
        getDocs(collectionRef).then((userDocs)=>{
            userDocs.forEach((userDoc)=>{
                console.log('user name',userDoc.id)
                let userCollection=collection(doc(collectionRef,userDoc.id),'userReviews')
                let q=query(userCollection,where('movieTitle','==',movie.title))
                if(q){
                    getDocs(q).then((moviesDocs)=>{
                        moviesDocs.forEach((movieDoc)=>{
                            console.log(movieDoc.id,'->',movieDoc.data())
                            tempReviews.push(movieDoc.data())
                            console.log('tempReviews',tempReviews)
                            setPresentReviews(tempReviews)
                            console.log('present reviews',presentReviews)
                        })
                    })
                }
            })
        })
    }
    function getstarRating(num){
        console.log('entered star rating')
        let n=Math.floor(num)
        let number = n<=5 ? n : (n%5 !=0 ? n%5:5)
        let rating=[]
        
        let unchecked=5-number
        for(let i=0;i<number;i++) {
            rating.push(<FontAwesomeIcon icon={faStar} className='checked' style={{color:'gold'}}/>)
        }
        for(let j=0;j<unchecked;j++) {
            rating.push( <FontAwesomeIcon icon={faStar} className="unchecked" style={{color:'gray'}}/> )
        }
        return rating
    }
    return (
        <div className="movieDetailComponent" style={{ position: 'relative' }}>
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
            <div className='mainSection' style={{ opacity: reviewCardStatus.opacity == true ? '0.5' : '1' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} >

                        <Grid item xs={1} >
                            <Item className="item item1">
                                <div className='icon-list'>
                                    <FontAwesomeIcon icon={faHouse} style={{ backgroundColor: iconColors.icon1 }} className='icon' onClick={() => {
                                        // onIconClick('icon1')
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
                            <Item className="item item2">

                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                    <Grid item xs={6}>
                                        <Item className="subItem">
                                            <div className='moviePage'>
                                                <img src={`http://image.tmdb.org/t/p/original/${movie.poster_path}`} className="moviePoster" />
                                                <h2 className="movieTitle">{movie.title}</h2>
                                                <Button variant="contained" className="postReviewBtn" onClick={handlePostReview}>Post Review</Button>
                                                <h4 style={{ fontSize: '1.1rem' }} className="my-1">Movie Overview :</h4>
                                                <p style={{ color: 'black', fontSize: '1rem' }}>{movie.overview}</p>
                                                <h4 style={{ fontSize: '1.3rem' }} className="my-1">Cast & Crew</h4>
                                                <div className="castList">
                                                    {
                                                        (movieCrew).map((value, index) => {
                                                            return <div key={index} className="cast">
                                                                <img src={`http://image.tmdb.org/t/p/original/${value.profile_path}`} style={{}} className="posterName" />
                                                                <h5>{value.name}</h5>
                                                                <h6>{value.character}</h6>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                                <div className="similarMovies">
                                                    <h3 className="my-1" style={{ fontSize: '1.5rem' }}>
                                                        Similar movies :
                                                    </h3>
                                                    <div className="movieList">
                                                        {
                                                            similarMovies.map((value, index) => {
                                                                return <div key={index} className="similarMovie">
                                                                    <img src={`http://image.tmdb.org/t/p/original/${value.poster_path}`} style={{}} onClick={() => { handleCardClick(value) }} />
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </Item>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Item className="subItem subItem2" style={{padding:'2rem'}}>
                                            <h2 style={{color:'black',textAlign:'left'}}>Review by cinema elk</h2>
                                            <div className='audienceReviews'>
                                                 {
                                                   presentReviews.map((movie,index)=>{
                                                       return <div className="MovieReviewCard" key={index}>
                                                       <h3>{movie.movieTitle}</h3>
                                                       <p className="comment">{movie.review}</p>
                                                       <div className="userReviewDiv">
                                                           <span className="userName"><FontAwesomeIcon icon={faUser} style={{color:'#5271ff',marginRight:'0.5rem'}}/> {movie.userName}</span>
                                                           <span className="star-rating">
                                                           
                                                           {
                                                               getstarRating(movie.rating).map((value,index)=>{
                                                                  return  <span key={index} className="star">{value}</span>
                                                               })
                                                           }
                                                           </span>
                                                       </div>
                                                    </div> 
                                                   })
                                                 }
                                            </div>
                                        </Item>
                                    </Grid>

                                </Grid>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <div className={`reviewCard ${reviewCardStatus.opacity == true ? 'absolute1' : ''}`} style={{ position: reviewCardStatus.position, display: reviewCardStatus.position == 'absolute' ? 'block' : 'none' }}>
                <h4>Enter your reviews :</h4>
                <textarea name="" id="" className="reviewContent" ref={reviewContentRef}></textarea>
                <div className="ratingDiv">
                    Rating <span><input type="number" ref={reviewRatingRef} /> out of 5</span>
                </div>
                <Button variant='contained' onClick={handleSubmitReview}>Submit</Button>
            </div>
        </div>
    )
}