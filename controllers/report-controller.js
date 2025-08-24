import { reportStore } from "../models/report-store.js";
import dayjs from "dayjs"; 

export const reportController = {
  async addReport(request, response) {
    const stationId = request.params.id;

    const newReport = {
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
      windDirection: request.body.windDirection || null,
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),  // add current date and time automatically when report is created 
    };

    console.log(`adding report to station ${stationId}`);
    await reportStore.addReport(stationId, newReport);

    response.redirect("/station/" + stationId);
  },
};
