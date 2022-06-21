import type { NextPage } from 'next'
import { useContext, useEffect } from 'react'
import { firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar/Navbar"  
import { useCookies } from 'react-cookie';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setUser } from "../redux/auth/authSlice";


const Home: NextPage = () => {
  return (
    <>
    <Navbar />
    <h1>Dashboard page</h1>
    </>
  )
}

export default Home
