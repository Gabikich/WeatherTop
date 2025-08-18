import { reportStore } from "../models/report-store.js";

export const reportController = {
  async addReport(request, response) {
    const stationId = request.params.id;

    const newReport = {
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
      windDirection: request.body.windDirection || null,
    };

    console.log(`adding report to station ${stationId}`);
    await reportStore.addReport(stationId, newReport);

    response.redirect("/station/" + stationId);
  },
};
