import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";


export const dashboardController = {
    async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const viewData = {
      title: "Weather Dashboard",
      stations: await stationStore.getStationsByUserId(loggedInUser._id),
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },


async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      name: request.body.name,
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  }, 

    async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },

    async deleteReport(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting report ${stationId}`);
    await stationStore.deleteReportById(reportId);
    response.redirect("/dashboard");
  },

  };
