/*
* Source: https://stackoverflow.com/questions/4898574/converting-24-hour-time-to-12-hour-time-w-am-pm-using-javascript
*/
/** @jsxImportSource @emotion/react */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import { faWind, faCloud, faUmbrella, faTemperatureEmpty, faTemperatureFull, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from '../components/Spinner';
import ErrorContainer from '../components/ErrorContainer';
import useWeatherSearch from '../hooks/useWeatherSearch';

const entireThing = css`
  display: flex;
  height: 100%;
  flex-direction: column;
  -ms-flex-direction: column;
`;

const headerStyle = css`
  border-style: solid;
  border-color: gray;
  border-width: 10px;
  background: cyan;
  height: 300px;
`;

const title = css`
  font-size: 50px;
  text-align: center;
`;

const styles = css`
  opacity: 0.75;
  border-radius: 25px;
  border-style: solid;
  border-color: 1px white;
  margin-bottom: 10px;
  width: 750px;
  margin-left: auto;
  margin-right: auto;
  background-color: gray;
  display: flex;
  margin-top: 10px;
`;

const footerStyle = css`
  text-align: center;
  border-style: solid;
  border-color: gray;
  background: cyan;
  height: 80px;
`;

const weathersStyle = css`
  overflow: scroll;
  height: 1000px;
  margin: 0;
  padding: 0;
  flex: 1;
  background-color: orange;
  background: url(background.png);
`;

const searchBar = css`
  display: flex;
  justify-content: center;
`;

const timeBox = css`
  margin: 20px;
  margin-left: auto;
  margin-right: auto;
  font-size: 30px;
  /* border: 1px solid; */
  display: block;
`;

const dateBox = css`
  /* border: 1px solid; */
  text-align: center;
  font-size: 20px;
  margin-top: 0;
`;

const leftSide = css`
display: block;
margin-left: auto;
margin-right: auto;
`;

const test = css`
  text-align: center;
  margin-top: 50px;
`;

const temperatureBox = css`
  text-align: center;
`;

const minTemp = css`
  display: inline-block;
  padding-right: 10px;
  color: rgb(0,255,255)
`;

const maxTemp = css`
  display: inline-block;
  padding-left: 10px;
  color: rgb(255,0,0)
`;

const humid = css`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

const precip = css`
  display: inline-block;
  padding-right: 10px;
`;

const wind = css`
  display: inline-block;
  padding-left: 10px;
`;

const desc = css `
   text-transform: uppercase;
   text-align: center;
   font-size: 50px;
   margin-top: auto;
   margin-bottom: auto;
`;

const botDiv = css `
  text-align: center;
`;

const warning = css`
  text-align: center;
`;
function displayWeather( weatherDay ) {
  const weathers = weatherDay.map(function(weather, index){
    var dt = new Date(weather["dt_txt"]).toString();
    //console.log(dt)
    var day, time, date = "";
    day = dt.substring(0, dt.indexOf(" "));
    dt = dt.substring(dt.indexOf(" ") + 1, dt.length);
    date = dt.substring(0, dt.indexOf(" ")+8);
    dt = dt.substring(dt.indexOf(" ")+9, dt.length);
    time = dt.substring(0, dt.indexOf(" ")).toLocaleString();

    //it is pm if hours from 12 onwards
    var currTime = parseInt(time.substring(0, 2));

    var suffix = (currTime >= 12)? 'PM' : 'AM';

    //only -12 from hours if it is greater than 12 (if not back at mid night)
    currTime = (currTime > 12)? currTime -12 : currTime;

    //if 00 then it is 12 am
    currTime = (currTime == '00')? 12 : currTime;


    return(
        <div css={styles}>

          <div css={timeBox}>
            <h1>{day}</h1>
            <h4 css={test}>{currTime+":00 " + suffix}</h4>
          </div>

          <div css={leftSide}>

            <div css={dateBox}>
              <h1>{date}</h1>
            </div>

            <div>
              <h3 css={desc}>{weather["weather"][0]["description"]}</h3>
            </div>

            <div css={temperatureBox}>
              <div css={minTemp}>
                <FontAwesomeIcon icon={faTemperatureEmpty} />
                <p>{weather["main"]["temp_min"] + "°F"}</p>
              </div>

              <div css={maxTemp}>
                <FontAwesomeIcon icon={faTemperatureFull} />
                <p>{weather["main"]["temp_max"] + "°F"}</p>
              </div>
            </div>
            <div css={botDiv}>
              <div css = {precip}>
              <FontAwesomeIcon
                icon={faUmbrella}
                style={{ margin: "auto" }}
              />
                <p>{"Precip Level: " + weather["pop"] + "%"}</p>
              </div>

              <div css={humid}>
              <FontAwesomeIcon
               icon={faCloud}
               style={{ margin: "auto" }}
               />
                <p>{"Humidity Level: " + weather["main"]["humidity"] + "%"}</p>
              </div>

              <div css={wind}>
              <FontAwesomeIcon
               icon={faWind}
               style={{ margin: "auto" }}
               />
                <p>{weather["wind"]["speed"] + " MPH"}</p>
              </div>
            </div>
          </div>

        </div>
    )
  })
  return (
    <div css={weathersStyle}>{weathers}</div>
  )
}

function Footer() {
  return (
    <div css={footerStyle}>
      <h1>5 Day/3 Hr Weather</h1>
      <FontAwesomeIcon icon={faSun}/>
    </div>
  );
}

function Search({ query }) {
  const [ inputQuery, setInputQuery ] = useState(query || "");
  const [ searchParams, setSearchParams ] = useSearchParams()

  const [ repos, loading, error ] = useWeatherSearch(query);

  return (
    <div css={entireThing}>
      <div css={headerStyle}>
        <h1 css={title}>Weather App</h1>
        <p css={warning}>Please enter a city and state in correct format. E.g. Salem, Oregon</p>
        <div css={searchBar}>
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearchParams({ q: inputQuery })
          }}>
            <input value={inputQuery} onChange={e => setInputQuery(e.target.value)} />
            <button type="submit">Search</button>
          </form>
        </div>
        <h2 css={searchBar}>Searching Weather For: {query}</h2>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {displayWeather( repos )}
        </div>
      )}
      {error && <ErrorContainer>Error!</ErrorContainer>}
      <Footer />
    </div>
  );
}

export default Search;
