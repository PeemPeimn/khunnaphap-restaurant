import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { 
  Box,
  Center, 
  Button, 
  Divider,
  Flex, 
  Image, 
  Link, 
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  IconButton
  } from "@chakra-ui/react"


import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from "firebase/database";
import { useEffect, useState } from 'react'
import { ArrowRightIcon } from '@chakra-ui/icons'
  

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600&display=swap" rel="stylesheet" />
      </Head>
      <Center display="flex" flexDirection='column'>
        <Box fontSize="50px" mt="10px">ร้านอาหาร &ensp; คุ ณ ภ า พ</Box>
        <TempHumid />
        <PriceInputBar />
      </Center>
    </>
  )
}


const TempHumid = (props) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAPjnvQoZ-kDO3H3VILgEBKSEFVmhWDCtU",
    authDomain: "smart-restaurant-3e84a.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://smart-restaurant-3e84a-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "smart-restaurant-3e84a",
    storageBucket: "smart-restaurant-3e84a.appspot.com",
    
  };

  const app = initializeApp(firebaseConfig);
  
  // Get a reference to the database service
  const database = getDatabase(app);
  const dbRef = ref(getDatabase());

  const [ tables, setValue ] = useState([0,0,0,0])
  const [ temp, setT ] = useState(0)
  const [ humid, setH ] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      var t = [0,0,0,0];
      t[0] = await get(child(dbRef, 'tables/1')).then((snapshot) => snapshot.val())
      t[1] = await get(child(dbRef, 'tables/2')).then((snapshot) => snapshot.val())
      t[2] = await get(child(dbRef, 'tables/3')).then((snapshot) => snapshot.val())
      t[3] = await get(child(dbRef, 'tables/4')).then((snapshot) => snapshot.val())
      var tem = await get(child(dbRef, 'temp')).then((snapshot) => snapshot.val())
      var hum = await get(child(dbRef, 'humid')).then((snapshot) => snapshot.val())
      console.log(t, tem, hum);
      setValue(t)
      setT(tem.toFixed(2))
      setH(hum.toFixed(2))

    }, 1000);
    return () => clearInterval(interval);
  }, [dbRef]);

  return (
    <>
    <Box display="flex" justifyContent="center" p="20px" borderRadius="20px" my="50px" boxShadow='0px 10px 30px 0px rgba(0, 0, 0, 0.2)'>
            <Box w="50px" h="50px" bgColor={tables[0]==1?'red':'green'} m="20px" />
            <Box w="50px" h="50px" bgColor={tables[1]==1?'red':'green'} m="20px" />
            <Box w="50px" h="50px" bgColor={tables[2]==1?'red':'green'} m="20px" />
            <Box w="50px" h="50px" bgColor={tables[3]==1?'red':'green'} m="20px" />
        </Box>
        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="center" flexDirection='column' alignItems="center" p="30px" mx="30px" borderRadius="20px" boxShadow='0px 10px 30px 0px rgba(0, 0, 0, 0.2)'>
            <Image src='https://i.ibb.co/S5SYfbT/thermometer.png' w="100px" my="10px" alt='temperature' />
            <Box textAlign="center" m="10px" fontSize="30px" color="gray">{temp} C</Box>
          </Box>
          <Box display="flex" justifyContent="center" flexDirection='column' alignItems="center" p="30px" mx="30px" borderRadius="20px" boxShadow='0px 10px 30px 0px rgba(0, 0, 0, 0.2)'>
            <Image src='https://i.ibb.co/HYtcZL7/humidity.png' w="100px" my="10px" alt='humidity' />
            <Box textAlign="center" m="10px" fontSize="30px" color="gray">{humid} %</Box>
          </Box>
    </Box>
    </>
  )
}

const PriceInputBar = (props) => {

  const firebaseConfig = {
    apiKey: "AIzaSyAPjnvQoZ-kDO3H3VILgEBKSEFVmhWDCtU",
    authDomain: "smart-restaurant-3e84a.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://smart-restaurant-3e84a-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "smart-restaurant-3e84a",
    storageBucket: "smart-restaurant-3e84a.appspot.com",
  };
  
  const app = initializeApp(firebaseConfig);
  
  // Get a reference to the database service
  const db = getDatabase(app);

  const [ value, setValue ] = useState()
  const [ isSubmitted, setSubmit ] = useState(false)


  function handleSubmit() {
    setSubmit(true)
    setInterval( () => {
      setSubmit(false)
    }, 500)
    value = parseInt(value)
    set(ref(db, 'price'), value);
    console.log(value)

  }
  return (
    <Flex my="100px" boxShadow='0px 10px 30px 0px rgba(0, 0, 0, 0.3)' borderRadius="10px 10px 10px 10px">
      <NumberInput onChange={ (value) => setValue(value) }
      width="300px"
      height="60px"
      fontSize="24px"
      value={value}
      borderColor="transparent"
      borderRadius="10px 0px 0px 10px"
      placeholder="Enter the total price.."
      focusBorderColor="gray"
      onKeyPress={ event => {
        if (event.key === 'Enter') {
          handleSubmit()
        }
      }}>  
        <NumberInputField w="100%" h="100%" borderColor="transparent" borderRadius="10px 0px 0px 10px" fontSize="20px"/>
      </NumberInput>
      <IconButton
        isLoading = { isSubmitted }
        bgColor={ isSubmitted ? '#d8e2dc' : '#ffd7ba' }
        _hover={{ bg: "#fec89a" }}
        borderColor="#d8e2dc !important"
        border="1px"
        borderRadius="0px 10px 10px 0px"
        w="60px"
        size="lg"
        icon={<ArrowRightIcon />}
        onClick={handleSubmit}
      />
    </Flex>
  )
}
