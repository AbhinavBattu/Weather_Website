// import React, { useState, useEffect, useContext,useCallback } from "react";
// import axios from "axios";
// import apiKeys from "./apiKeys";
// import Clock from "react-live-clock";
// import Forcast from "./forcast";
// import loader from "./images/WeatherIcons.gif";
// import WeatherCard from "./WeatherCard";
// import WeatherScroll from "./WeatherScroll";
// import { WeatherContext } from "./context/context";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const dateBuilder = (d) => {
//   let months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//   let day = days[d.getDay()];
//   let date = d.getDate();
//   let month = months[d.getMonth()];
//   let year = d.getFullYear();

//   return `${day}, ${date} ${month} ${year}`;
// };

// const defaults = {
//   color: "white",
//   size: 112,
//   animate: true,
// };

// const Weather = () => {
//   const [state, setState] = useState({
//     errorMessage: undefined,
//     temperatureC: undefined,
//     temperatureF: undefined,
//     feels_like:undefined,
//     city: undefined,
//     country: undefined,
//     humidity: undefined,
//     pressure:undefined,
//     description: undefined,
//     visibilty:undefined,
//     icon: "CLEAR_DAY",
//     name:undefined,
//     dt:undefined,
//     windspeed:undefined,
//     sunrise: undefined,
//     sunset: undefined,
//     errorMsg: undefined,
//   });
//   const { loc, setloc, threshold,degree } = useContext(WeatherContext);
//   const [summaries, setSummaries] = useState([]);
//   const [weeklySummaries, setWeeklySummaries] = useState([]);

//   const getWeather =useCallback(async () => {
//     try {
//       const data = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKeys.key}`);
//       //console.log(new Date(Date.now()).getMinutes().toString().padStart(2, '0'));
//       if ((data.data.main.temp-273.15) > threshold) {
//         toast.error(`Temperature threshold of ${threshold}°C breached! Current temperature: ${Math.round(data.data.main.temp-273.15)}°C`);
//       }
//       console.log(data.data);
//       const newIcon = getIcon(data.data.weather[0].main);
//       setState((prevState) => ({
//         ...prevState,
//         city: loc,
//         temperatureC: Math.round(data.data.main.temp-273.15 ),
//         temperatureF: Math.round((data.data.main.temp-273.15)*9/5+32),
//         feels_like:Math.round(data.data.main.feels_like),
//         humidity: data.data.main.humidity,
//         pressure:data.data.main.pressure,
//         main: data.data.weather[0].main,
//         name:data.data.name,
//         country: data.data.sys.country,
//         windspeed:data.data.wind.speed,
//         visibility:data.data.visibility,
//         icon: newIcon,
//         dt:data.data.dt,
//       }));
//       // console.log(newIcon);
//     } catch (error) {
//       console.error("Error fetching weather data:", error);
//     }
//   });

//   const getIcon = (weatheru) => {
//     switch (weatheru) {
//       case "Haze":
//         return "FOG";
//       case "Clouds":
//         return "CLOUDY";
//       case "Rain":
//         return "RAIN";
//       case "Snow":
//         return "SNOW";
//       case "Dust":
//         return "WIND";
//       case "Drizzle":
//         return "SLEET";
//       case "Fog":
//       case "Smoke":
//         return "FOG";
//       case "Tornado":
//         return "WIND";
//       case "Mist":
//         return "FOG";
//       default:
//         return "CLEAR_DAY";
//     }
//   };

//   useEffect(() => {
//     if (loc) {
//       getWeather();
//     }
//   }, [getWeather, loc, threshold]);

//   useEffect(() => {
//     const fetchSummaries = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/daily-summaries/${loc}`);
//         setSummaries(response.data[0]);
//       } catch (error) {
//         console.error("Error fetching summaries:", error);
//       }
//     };

//     if (loc) {
//       fetchSummaries();
//     }
//   }, [loc]);

//   useEffect(() => {
//     const fetchWeeklySummaries = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/weekly-summaries/${loc}`);
//         setWeeklySummaries(response.data);
//       } catch (error) {
//         console.error("Error fetching weekly summaries:", error);
//       }
//     };

//     if (loc) {
//       fetchWeeklySummaries();
//     }
//   }, [loc]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       getWeather();
//     }, 5 * 60 * 1000); // 5 minutes

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [getWeather, loc]);

//   if (state.temperatureC) {
//     return (
//       <div className="container">
//         <div className="leftp">
//           <div className="city">
//             <div className="title">
//               <h2>{state.city}</h2>
//               <h3>{state.country}</h3>
//             </div>
//             <div className="date-time">
//               <div className="dmy">
//                 <div id="txt"></div>
//                 <div className="current-time">
//                   <Clock format="HH:mm:ss" interval={1000} ticking={true} />
//                 </div>
//                 <div className="current-date">{dateBuilder(new Date())}</div>
//               </div>
//               <div className="temperature">
//               {console.log(state.temperatureC)}
//                 <p>
//                   {degree==='C' ? state.temperatureC : state.temperatureF}°<span>{degree}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="Daily-Summary">
//             <WeatherCard
//               avgTemp={summaries.avgTemp}
//               maxTemp={summaries.maxTemp}
//               minTemp={summaries.minTemp}
//               dominant={summaries.dominantWeather}
//             />
//           </div>
//           <WeatherScroll weatherData={weeklySummaries} />
//         </div>
//         <div className="rightp">
//           {/* {console.log(state.icon)} */}
//           <Forcast icon={state.icon} tempC={state.temperatureC} tempF={state.temperatureF} weather={state.main} feels_like={state.feels_like} humidity={state.humidity} pressure={state.pressure} visibility={state.visibility} country={state.country} name={state.name} windspeed={state.windspeed} dt={state.dt}/>
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <React.Fragment>
//         <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
//         <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
//           Detecting your location
//         </h3>
//         <h3 style={{ color: "white", marginTop: "10px" }}>
//           Your current location will be displayed on the App <br /> & used
//           for calculating Real time weather.
//         </h3>
//       </React.Fragment>
//     );
//   }
// };

// export default Weather;
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import WeatherCard from "./WeatherCard";
import WeatherScroll from "./WeatherScroll";
import { WeatherContext } from "./context/context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dateBuilder = (d) => {
  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const formatTimestampToIST = (timestamp) => {
  const date = new Date(timestamp * 1000);
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();

  hours += 5;
  minutes += 30;

  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  if (hours >= 24) {
    hours -= 24;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const Weather = () => {
  const [state, setState] = useState({
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    feels_like: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    pressure: undefined,
    description: undefined,
    visibility: undefined,
    icon: "CLEAR_DAY",
    name: undefined,
    dt: undefined,
    windspeed: undefined,
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });
  const { loc, threshold, degree } = useContext(WeatherContext);
  const [summaries, setSummaries] = useState([]);
  const [weeklySummaries, setWeeklySummaries] = useState([]);

  const getWeather = useCallback(async () => {
    try {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKeys.key}`);
      
      if ((data.main.temp - 273.15) > threshold) {
        toast.error(`Temperature threshold of ${threshold}°C breached! Current temperature: ${Math.round(data.main.temp - 273.15)}°C`);
      }

      const newIcon = getIcon(data.weather[0].main);
      setState((prevState) => ({
        ...prevState,
        city: loc,
        temperatureC: Math.round(data.main.temp - 273.15),
        temperatureF: Math.round((data.main.temp - 273.15) * 9 / 5 + 32),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        main: data.weather[0].main,
        name: data.name,
        country: data.sys.country,
        windspeed: data.wind.speed,
        visibility: data.visibility,
        icon: newIcon,
        dt: data.dt,
      }));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [loc, threshold]);

  const getIcon = (weather) => {
    switch (weather) {
      case "Haze":
        return "FOG";
      case "Clouds":
        return "CLOUDY";
      case "Rain":
        return "RAIN";
      case "Snow":
        return "SNOW";
      case "Dust":
        return "WIND";
      case "Drizzle":
        return "SLEET";
      case "Fog":
      case "Smoke":
        return "FOG";
      case "Tornado":
        return "WIND";
      case "Mist":
        return "FOG";
      default:
        return "CLEAR_DAY";
    }
  };

  useEffect(() => {
    if (loc) {
      getWeather();
    }
  }, [getWeather, loc]);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/daily-summaries/${loc}`);
        setSummaries(response.data[0]);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      }
    };

    if (loc) {
      fetchSummaries();
    }
  }, [loc]);

  useEffect(() => {
    const fetchWeeklySummaries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/weekly-summaries/${loc}`);
        setWeeklySummaries(response.data);
      } catch (error) {
        console.error("Error fetching weekly summaries:", error);
      }
    };

    if (loc) {
      fetchWeeklySummaries();
    }
  }, [loc]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getWeather();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [getWeather]);

  if (state.temperatureC) {
    return (
      <div className="container">
        <div className="leftp">
          <div className="city">
            <div className="title">
              <h2>{state.city}</h2>
              <h3>{state.country}</h3>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {degree === 'C' ? state.temperatureC : state.temperatureF}°<span>{degree}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="Daily-Summary">
            <WeatherCard
              avgTemp={summaries.avgTemp}
              maxTemp={summaries.maxTemp}
              minTemp={summaries.minTemp}
              dominant={summaries.dominantWeather}
            />
          </div>
          <WeatherScroll weatherData={weeklySummaries} />
        </div>
        <div className="rightp">
          <Forcast 
            icon={state.icon} 
            tempC={state.temperatureC} 
            tempF={state.temperatureF} 
            weather={state.main} 
            feels_like={state.feels_like} 
            humidity={state.humidity} 
            pressure={state.pressure} 
            visibility={state.visibility} 
            country={state.country} 
            name={state.name} 
            windspeed={state.windspeed} 
            dt={state.dt}
          />
        </div>
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App <br /> & used
          for calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }
};

export default Weather;
