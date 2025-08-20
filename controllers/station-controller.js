import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

    
// helpers locais
function min(arr, key) {
  if (!arr || arr.length === 0) return null;
  return Math.min(...arr.map((r) => Number(r[key])));
}
function max(arr, key) {
  if (!arr || arr.length === 0) return null;
  return Math.max(...arr.map((r) => Number(r[key])));
}

export const stationController = {
  async index(request, response) {
    // 1) recuperar a estação e seus reports
    const station = await stationStore.getStationById(request.params.id);
    const reports = await reportStore.getReportsByStationId(request.params.id);
    station.reports = reports || [];

        // 2) calcular min/max (arr and key)
    const stats = {
      minTemp: min(station.reports, "temp"),
      maxTemp: max(station.reports, "temp"),
      minWind: min(station.reports, "windSpeed"),
      maxWind: max(station.reports, "windSpeed"),
      minPressure: min(station.reports, "pressure"),
      maxPressure: max(station.reports, "pressure"),
    };

    // 3) montar o objeto viewData no estilo lab
    const viewData = {
      title: station.name,
      station: station,
      stats: stats,
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




