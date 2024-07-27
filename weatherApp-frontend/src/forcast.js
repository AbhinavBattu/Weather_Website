import React, { useState,useCallback, useContext } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import { WeatherContext } from './context/context';

// const {loc,setloc}=useContext(weatherContext);
function Forcast(props) {
  const [query, setQuery] = useState("Delhi");
  const [error, setError] = useState("");
  // const [weather, setWeather] = useState({});
  const [inputValue, setInputValue] = useState('');
  // const [icon,setIcon]=useState("https://openweathermap.org/img/wn/01d.png");
  // State to store the threshold value
  const {setloc,threshold, setThreshold,degree,setDegree} = useContext(WeatherContext);

  const handleButtonClick = () => {
    const tempValue = parseFloat(inputValue);
    if (!isNaN(tempValue)) {
      setThreshold(tempValue);
    } else {
      alert('Please enter a valid number');
    }
  };
  const search = useCallback((city) => {
    setloc(query);
  },[query, setloc]);
  // function checkTime(i) {
  //   if (i < 10) {
  //     i = "0" + i;
  //   } // add zero in front of numbers < 10
  //   return i;
  // }
  function formatTimestampToTime(timestamp) {
    // Convert timestamp to milliseconds (JavaScript uses milliseconds)
    const date = new Date(timestamp * 1000);

    // Extract hours and minutes
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    hours += 5;
    minutes += 30;

    // Handle minute overflow
    if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
    }

    // Handle hour overflow
    if (hours >= 24) {
        hours -= 24;
    }
    // Format hours and minutes to HH:MM
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return formattedTime;
}

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <select
            className="city-dropdown"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              marginRight: '10px',
              width: '200px',
            }}
          >
            <option value="" selected>Select a city</option>
            <option value="Delhi">Delhi</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
          </select>
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              alt="Search"
              onClick={search}
              style={{
                cursor: 'pointer',
                width: '24px',
                height: '24px',
              }}
            />
          </div>
          <div style={{ display: 'inline-block', fontSize: '17px' }}>
            <label htmlFor="tempUnit" style={{ marginRight: '5px' }}>Unit:</label>
            <select
              id="tempUnit"
              value={degree}
              onChange={(e)=>setDegree(e.target.value)}
              style={{
                padding: '10px',
                fontSize: '15px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                outline: 'none'
              }}
            >
              <option value="C">Celsius</option>
              <option value="F">Fahrenheit</option>
            </select>
          </div>
        </div>
        <ul>
          {typeof props.name != "undefined" ? (
            <div className="matrics">
              {/* {" "} */}
              <li className="cityHead">
                <p>
                  {props.name}, {props.country}
                </p>
                <div className="update-time">
                  <p>Updated At: {" "}{formatTimestampToTime(props.dt)}</p>
                </div>
              </li>
              {console.log(props.temperatureC)}
              <li>
                Temperature{" "}
                {degree === 'C' ? (
                  <span className="temp">
                    {props.tempC}°C ({props.weather})
                  </span>
                ) : (
                  <span className="temp">
                    {props.tempF}°F ({props.weather})
                  </span>
                )}
              </li>
              <li>
                Feels Like{" "}
                {degree === 'C' ? (
                  <span className="temp">
                    {Math.round(props.feels_like-273.15)}°C ({props.weather})
                  </span>
                ) : (
                  <span className="temp">
                    {Math.round((props.feels_like-273.15)*9/5+32)}°F ({props.weather})
                  </span>
                )}
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(props.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(props.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(props.windspeed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>
              {error.query} {error.message}
            </li>
          )}
        </ul>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginTop: '20px',
        backgroundColor: '#f9f9f9',
        position: 'absolute',
        bottom: '0',
        width: '95%'
      }}>
        <input
          type="number"
          value={inputValue}
          placeholder="Alert when temp exceeds."
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            marginRight: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '16px',
            flex: '1',
          }}
        />
        <button
          onClick={handleButtonClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Set Threshold
        </button>
        {threshold !== null && (
          <span style={{ marginLeft: '10px', fontSize: '15px' }}>
            Selected Threshold: {threshold}°
          </span>
        )}
    </div>
    </div>
  );
}
export default Forcast;
