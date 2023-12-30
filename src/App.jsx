
import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import MovieDetails from './components/movieDetails'
import { Route,Routes } from 'react-router-dom'
import Home from './components/Home'
import AllMoviesReviews from './components/AllMoviesReviews'
import MyReviews from './components/MyReviews'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

function App() {

  return (
   <div className='app'>
    {/* <Login/>
    <Signup/> */}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/movieDetails' element={<MovieDetails/>} />
      <Route path='/allMoviesReviews' element={<AllMoviesReviews/>}/>
      <Route path='/myReviews' element={<MyReviews/>}/>
    </Routes>
   </div>
  )
}

export default App
