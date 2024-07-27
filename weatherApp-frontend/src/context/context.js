import axios from "axios";
import React,{createContext,useEffect,useState} from "react";
//import {getNewsAPI, getSourceAPI} from "./api";

export const WeatherContext=createContext();

const Context =({children}) => {
    const [loc,setloc] =useState("Delhi");
    const [threshold, setThreshold] = useState(100);
    const [degree,setDegree]=useState("C");
    // const fetchNews=async (reset=category)=>{
    //     const {data} =await axios.get(getNewsAPI(reset));
    //     setnews(data);
    //     setIndex(1);
    // }

    // const fetchNewsFromSource=async()=>{
    //     try{
    //         const {data}=await axios.get(getSourceAPI(source));
    //         setnews(data);
    //         setIndex(1);
    //     }catch(error){
    //         //console.log(error);
    //     }
    // }

    // useEffect(()=>{
    //     fetchNews();
    // },[category])

    // useEffect(()=>{
    //     fetchNewsFromSource();
    // },[source])

    return (
        <WeatherContext.Provider value={{loc,setloc,threshold,setThreshold,degree,setDegree}}>
            {children}
        </WeatherContext.Provider>
    );
};

export default Context;