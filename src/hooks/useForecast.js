import { useState } from "react";
import axios from "axios";

// helpers
import getCurrentDayForecast from "../helpers/getCurrentDayForecast";
import getCurrentDayDetailedForecast from "../helpers/getCurrentDayDetailedForecast";
import getUpcomingDaysForecast from "../helpers/getUpcomingDaysForecast";

const BASE_URL = 'https://www.metaweather.com/api/location'
const CROSS_DOMAIN = 'https://the-ultimate-api-challenge.herokuapp.com'
const REQUEST_URL = `${CROSS_DOMAIN}/${BASE_URL}`

const useForecast = () => {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  // get where on earth_id
  const getWoeid = async (location) => {
    // destructuring response to pull data out
    const {data} = await axios(`${REQUEST_URL}/search`, {params: {query: location}});
    // console.log({data});

    if (!data || data.length === 0) {
      setError('Location not found, please enter a new location!');
      setLoading(false);
      return;
    }
    return data[0];
  };

  // get weather
  const getForecastData = async (woeid) => {
    const {data} = await axios(`${REQUEST_URL}/${woeid}`)

    if (!data || data.length === 0) {
      setError('Error locating forecast data');
      setLoading(false);
      return;
    }
    return data;
  }

  const gatherForecastData = (data) => {
    const currentDay = getCurrentDayForecast(data.consolidated_weather[0], data.title);
    const currentDayDetails = getCurrentDayDetailedForecast(data.consolidated_weather[0]);
    const upcomingDays = getUpcomingDaysForecast(data.consolidated_weather);

    setForecast({currentDay, currentDayDetails, upcomingDays});
    setLoading(false);
  };

  const submitRequest = async location => {
    setLoading(true);
    setError(false);

    const response = await getWoeid(location);
    // if no response or no woeid, end
    if (!response?.woeid) return;

    const data = await getForecastData(response.woeid);

    console.log({data});
    gatherForecastData(data);
  };

  return {
    isError, 
    isLoading, 
    forecast,
    submitRequest
  };
  
};

export default useForecast;