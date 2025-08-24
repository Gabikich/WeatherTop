import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import axios from "axios";
    
// helpers locais
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

export const stationController = {
  async index(request, response) {
    // 1) geet stations and reports 
    const station = await stationStore.getStationById(request.params.id);
    const reports = await reportStore.getReportsByStationId(request.params.id);
    station.reports = reports || [];

    // 2) get lastest  report 
    let latest = station.reports.length > 0 ? station.reports[station.reports.length - 1] : null;


    //3) calculate min/max/latest (arr and key)
    const stats = {
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

    // 4) build summary (for weather card)
    const summary = latest
      ? {
          code: latest.code,
          icon: iconUrlForCode(latest.code),
          description: weatherDescription(latest.code),
        }
      : null;
    // console.log("Generated Summary:", summary);

    // 5) data for the graphic 
    const trendLabels = [];
    const tempTrend = [];

for (let r of station.reports) {
  trendLabels.push(r.date);   // use data as label
  tempTrend.push(r.temp);     // use temp
}

    const viewData = {
      title: station.name,
      station: station,
      stats: stats,
      summary: summary,
      reading: {
      trendLabels: trendLabels,
      tempTrend: tempTrend,
    },
    };

    console.log("station rendering", viewData);
    response.render("station-view", viewData);
  },


  async deleteReport(request, response) {
  const stationId = request.params.stationid;
  const reportId = request.params.reportid;
  console.log(`Deleting Report ${reportId} from Station ${stationId}`);
  await reportStore.deleteReportById(reportId);
  response.redirect("/station/" + stationId);
},
};





