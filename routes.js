import express from "express";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { reportController } from "./controllers/report-controller.js";
import { accountsController } from './controllers/accounts-controller.js';



export const router = express.Router();

// dashboard
// router.get("/", dashboardController.index);
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);

//about
router.get("/about", aboutController.index);

//station
router.get("/station/:id", stationController.index);
router.post("/station/:id/addreport", reportController.addReport); // add report manual 
router.get("/dashboard/deletestation/:id", dashboardController.deleteStation);
router.get("/station/:stationid/deletereport/:reportid", stationController.deleteReport);

// auto reading from API OpenWeather

router.post("/dashboard/addreport", dashboardController.addreport); // add auto report 



//accounts / welcome
router.get("/", accountsController.index);
router.get("/login", accountsController.login);  //render login page
router.get("/signup", accountsController.signup); //render signup page
router.get("/logout", accountsController.logout); //redirect
router.post("/register", accountsController.register);   //signup form
router.post("/authenticate", accountsController.authenticate); //login form

