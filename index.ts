import {getDischargeStatus} from "./api-service";
import {tweetDischarge} from "./twitter-service";
import {init, retrieveDischarges} from "./datastore";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function run() {
    console.log("Running Thames Water Discharge");
    console.log("Initting data store");
    await init();
    console.log("Getting existing discharges");
    let existingDischarges = await retrieveDischarges();
    console.log("Getting discharge status");
    let dischargeStatus = await getDischargeStatus(existingDischarges);
    let newItems = dischargeStatus.newDischargingItems;
    for (let i = 0; i < newItems.length; i++) {
        await tweetDischarge(newItems[i]);
        await sleep(5000);
    }
    console.log("Completed Thames Water Discharge");
}

run()
    .then(function() {
        process.exit(0);
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    })
