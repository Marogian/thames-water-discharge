import { Headers } from 'node-fetch';
import fetch  = require("node-fetch");

let myHeaders = new Headers();
myHeaders.append("client_id", process.env.TW_CLIENT_ID);
myHeaders.append("client_secret", process.env.TW_CLIENT_SECRET);

let apiRoot = "https://prod-tw-opendata-app.uk-e1.cloudhub.io";
let apiResource = "/data/STE/v1/DischargeCurrentStatus";
let apiURL = apiRoot + apiResource;

let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: "follow" as const
};

const getDischargeStatus = async function (existingDischarges) {
    let currentDate = new Date().getTime();
    try {
        let result = await fetch(apiURL, requestOptions)
            .then(response => response.text());
        console.log("Got response");
        let results = JSON.parse(result);
        let items = results.items;
        let dischargingItems = items.filter(i => i.AlertStatus === 'Discharging');
        let validDischargingItems = dischargingItems.filter(function (item) {
            let dischargeDate = new Date(item.MostRecentDischargeAlertStart).getTime();
            let minutesSinceDischargeStart = (currentDate - dischargeDate) / 1000 / 60;
            return (minutesSinceDischargeStart <= 60 * 24 * 7);
        });
        let newDischargingItems = validDischargingItems.filter(function(item) {
            let dischargeDate = new Date(item.MostRecentDischargeAlertStart).getTime();
            return !existingDischarges.find(eD => eD.location_id === item.PermitNumber && eD.start_ts === dischargeDate);
        });
        console.log(`Currently ${dischargingItems.length} discharging drains`);
        console.log(`${newDischargingItems.length} newly discharging drains`);
        return {
            dischargingItems: dischargingItems,
            newDischargingItems: newDischargingItems,
        }
    } catch (e) {
        console.error("Error getting results", e);
    }
};

export {
    getDischargeStatus
};