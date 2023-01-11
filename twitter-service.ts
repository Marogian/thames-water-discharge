import {storeDischarge} from "./datastore";

import { TwitterApi } from 'twitter-api-v2';
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const TWEET_TEMPLATES = [
    `Congratulations %location! We’re currently discharging “up to 95% rainwater” into your local waterways! If you fancy a swim in %waterway, remember your penicillin.`,
    `Hey %location! Thames Water is busy emptying “up to 95% rainwater” into your environment! It probably isn't a great time to go for a swim in %waterway...`,
    `Thames Water giving %location the gift of raw sewage in the local waterways. Perfect for all your swimming, fishing, and drinking needs. #ThanksThamesWater`,
    `Feeling adventurous? Try swimming in the sewage-filled waters of %location, brought to you by Thames Water. #SewageSurfing`,
    `Thames Water is making sure that %location has plenty of waste to go around. The rivers and canals of the city will never run clear. #SewageCity`,
    `Looking for a new spot to fish? Check out the local waterways in %location, generously stocked with raw sewage by Thames Water. #FishingHeaven`,
    `Thames Water is doing their part to make sure the %location beaches are extra lively with raw sewage. #BeachDay`,
    `Heads up %location, Thames Water is doing their best to bring sewage right to your doorstep by discharging it into local waterways. #SewageDelivery`,
    `Thames Water just made the waterways of %location even more picturesque with their sewage discharges. #WaterView`,
    `Thanks to Thames Water, the %location waterways are now a fantastic place for all your sewage related activities. #SewageCentral`,
    `Visiting %location? Make sure to check out the local waterways, now filled with raw sewage, brought to you by Thames Water. #SewageTourism`,
    `Take a dip in the raw sewage-filled waters of %location. Brought to you by Thames Water, because they care about your swimming experience. #SewageSwimming`,
    `Good news, %location! Thames Water is bringing you the freshest raw sewage straight from our storm drains to your local waterways. #Yum`,
    `Hey %location, don't forget to pack a snorkel for your next trip to the beach. Thames Water is generously discharging sewage into the sea. #Fun`,
    `Just another day in %location, where Thames Water is releasing untreated waste into the %waterway for your swimming pleasure. #Classy`,
    `Thames Water says no to processed sewage and yes to raw sewage in the rivers, making %location the place to be for an authentic sewage swimming experience. #Trendy`,
    `Thames Water is proud to announce the grand opening of its new sewage water park in %location! Where you can swim, play and relax in untreated waste! #Luxury`,
    `Here's a tip for anyone visiting %location - stay away from the local waterways if you don't want to end up swimming in sewage, thanks to Thames Water. #Romantic`,
    `If you're looking for a unique date idea, why not try the Thames Water sewage-stream boat tour in %location? Nothing says love like raw waste in the water. #Quality`,
    `Another day, another sewage discharge from Thames Water. This time in %location. Don't forget to pack a nose plug for your next swim in the river. #Stinky`,
    `Good morning %location! Start your day off right with a refreshing dip in sewage, courtesy of Thames Water. Because who doesn't love a good dose of raw waste in the morning? #Energizing`
]

const tweetDischarge = async function(dischargeItem) {
    let tweetedName = dischargeItem.LocationName.indexOf(' ') === -1 ? '#' + dischargeItem.LocationName : dischargeItem.LocationName;
    let tweet = TWEET_TEMPLATES[Math.floor(Math.random()*TWEET_TEMPLATES.length) + 1];
    let tweetContent = tweet.replace('%location',tweetedName).replace('%waterway',dischargeItem.ReceivingWaterCourse);
    tweetContent += '\n\n https://www.thameswater.co.uk/edm-map';
    console.log("Tweeting", tweetContent);
    await storeDischarge(dischargeItem);
    await twitterClient.v2.tweet(tweetContent);
}

export {tweetDischarge};