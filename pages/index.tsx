import type { NextPage } from 'next'
import { useContext } from 'react'
import { firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar/Navbar"  


export async function getServerSideProps() {
  const docRef = doc(firestore, "test", "test");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  // console.log(data);
  return {
    props: {
  
    }
  }
}


const Home: NextPage = () => {

  return (
    <>
    <Navbar />
    <h1>Dashboard page</h1>
    </>
  )
}

export default Home
