import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    
    station._id = v4();
    station.reports = [];
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationById(id) {
    await db.read();
    return db.data.stations.find((station) => station._id === id);
  },

  async deleteStation(id) {
    await db.read();
    db.data.stations = db.data.stations.filter((s) => s._id !== id);
    await db.write();
  },


  async getStationsByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },






};
