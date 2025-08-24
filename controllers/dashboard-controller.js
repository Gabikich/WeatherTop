import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { reportStore } from "../models/report-store.js";
import axios from "axios";
import dayjs from "dayjs";


// to calculate min and max 

function min(arr, key) {
  if (!arr || arr.length === 0) return null;
  return Math.min(...arr.map((r) => Number(r[key])));
}
function max(arr, key) {
  if (!arr || arr.length === 0) return null;
  return Math.max(...arr.map((r) => Number(r[key])));
}

// to get weather + icon
function iconUrlForCode(code) {
  if (code === 800) return "https://openweathermap.org/img/wn/01d@2x.png";
  if (code >= 200 && code <= 232) return "https://openweathermap.org/img/wn/11d@2x.png";
  if (code >= 500 && code <= 531) return "https://openweathermap.org/img/wn/10d@2x.png";
  if (code >= 600 && code <= 622) return "https://openweathermap.org/img/wn/13d@2x.png";
  if (code >= 801 && code <= 804) return "https://openweathermap.org/img/wn/04d@2x.png";
  return "https://openweathermap.org/img/wn/04d@2x.png";
}

//  to get weather + description
function weatherDescription(code) {
  if (code === 800) return "Sunny";
  if (code >= 200 && code <= 232) return "Thunderstorm";
  if (code >= 300 && code <= 321) return "Drizzle";
  if (code >= 500 && code <= 531) return "Rain";
  if (code >= 600 && code <= 622) return "Snow";
  if (code >= 701 && code <= 781) return "Fog";
  if (code >= 801 && code <= 804) return "Partly Cloudy";
  return "Unknown";
}


export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    let stations = await stationStore.getStationsByUserId(loggedInUser._id);

    // takes the report from every stations + calculate the stats
    for (let station of stations) {
      const reports = await reportStore.getReportsByStationId(station._id);
      station.reports = reports || [];


       // latest report
      let latest = null;
      if (station.reports.length > 0) {
        latest = station.reports[station.reports.length - 1];
      }

      // for the weather card 
      station.summary = latest
        ? {
          code: latest.code,
          icon: iconUrlForCode(latest.code),
          description: weatherDescription(latest.code),
          }
        : null;

        // for the other cards
        station.stats = {
        latestTemp: latest ? latest.temp : null,
        minTemp: min(station.reports, "temp"),
        maxTemp: max(station.reports, "temp"),

        latestWind: latest ? latest.windSpeed : null,
        minWind: min(station.reports, "windSpeed"),
        maxWind: max(station.reports, "windSpeed"),

        latestPressure: latest ? latest.pressure : null,
        minPressure: min(station.reports, "pressure"),
        maxPressure: max(station.reports, "pressure"),
      };
    
        // alphabetically sort stations
    stations.sort((a, b) => a.name.localeCompare(b.name));

    }

    // send to view 
    const viewData = {
      title: "Weather Dashboard",
      stations: stations,
      user: loggedInUser,     // it will show the menu when a user is logged in 
    };

   //  console.log("dashboard rendering with stats", viewData);
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      name: request.body.name,
      userid: loggedInUser._id,
      lat: parseFloat(request.body.lat),   
      lng: parseFloat(request.body.lng),
    };
    // console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) {
    const stationId = request.params.id;
    // console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },

  // ADDING REPORT FROM API 
  async addreport(request, response) {
  const stationId = request.body.id;
  const lat = request.body.lat;
  const lng = request.body.lng;

  const latLongRequestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=8bd67c6cff216abb9a47714244272595`;

  try {
    const result = await axios.get(latLongRequestUrl);
    // console.log(latLongRequestUrl);

    if (result.status === 200) {
      const currentWeather = result.data;
      const report = {
        code: currentWeather.weather[0].id,
        temp: currentWeather.main.temp,        // use temp
        windSpeed: currentWeather.wind.speed,
        pressure: currentWeather.main.pressure,
        windDirection: currentWeather.wind.deg,
        date: dayjs().format("YYYY-MM-DD HH:mm:ss"), 
      };

    //  console.log(report);
      await reportStore.addReport(stationId, report);
    }
  } catch (error) {
   // console.error("Error fetching data from API:", error);
  }
  response.redirect("/station/" + stationId);
},

};
