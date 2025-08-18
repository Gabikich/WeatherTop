import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";


export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const reports = await reportStore.getReportsByStationId(request.params.id);

    station.reports = reports || [];

    const viewData = {
      title: "Station",
      station: station,
    };

    console.log("station rendering");
    response.render("station-view", viewData);
  },
};

