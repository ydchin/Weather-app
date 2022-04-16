import React, { useState, useEffect } from 'react';

function useWeatherSearch(query) {
  const [ repos, setRepos ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);
  var cityState = {
    city: "",
    state: "",
  };

  useEffect(() => {

    // Parse user input
    if( query != null) {
        if(query.includes(',')){
          cityState.city = query.substring(0, query.indexOf(","))
          cityState.state = query.substring(query.indexOf(",")+2, query.length)
          console.log("=== cityState", cityState)
        }
    }

    let ignore = false;
    const controller = new AbortController();
    async function fetchSearchResults() {
      let responseBody = {};
      let responseBody2 = {};
      setLoading(true);
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${cityState.city}&limit=5&appid=d18b9b3d2ae52b4c4f2bede074f54576`,
          { signal: controller.signal }
        );
        responseBody = await response.json();
      } catch (e) {
        if (e instanceof DOMException) {
          console.log("== HTTP request cancelled")
        } else {
          setError(true);
          throw e;
        }
      }
      console.log("===response body", responseBody)


      //Loop to find right state
      var index=0
      for(index; index < responseBody.length; index++){
        if(responseBody[index]['state'] === cityState.state){
          break;
        }
      }

      try {
        const response2 = await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?lat=${responseBody[index]['lat']}&lon=${responseBody[index]['lon']}&appid=d18b9b3d2ae52b4c4f2bede074f54576&units=imperial`,
          { signal: controller.signal }
        );
        responseBody2 = await response2.json();
      }catch (e) {
        if (e instanceof DOMException) {
          console.log("== HTTP request cancelled")
        } else {
          setError(true);
          throw e;
        }
      }

      console.log("actual weather data", responseBody2)
      // AFTER API CALLS!!!!
      if (!ignore) {
        setLoading(false);
        setError(false);
        setRepos(responseBody2["list"] || []);
      }
    }
    if (query) {
      fetchSearchResults()
    }
    return () => {
      controller.abort();
      ignore = true;
    }
  }, [ query ]);

  return [ repos, loading, error ];
}

export default useWeatherSearch;
