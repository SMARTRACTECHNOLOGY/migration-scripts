const mongoose = require("mongoose");
// var uuid = require('uuid')

console.log("Started the Script>>>>>>>>>>>>>>>>>>");

const lowercaseKeys = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase().trim()] = obj[key];
    return acc;
  }, {});
// new prod string url
// var mongoDb = mongoose.createConnection('mongodb://127.0.0.1:27017/smartcosmos?authSource=admin?ssl=true&retryWrites=false');
var mongoDb = "mongodb://127.0.0.1:27017/local";
var db = mongoose.createConnection(mongoDb);
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", async function () {
  try {
    let telemetryData = await db.collection("telemetry-datas1").find().toArray();
    let count = 0;
    for (let telemetry of telemetryData) {
      await db.collection("telemetry-datas1").updateOne(
        { _id: telemetry._id },
        {
          $set: telemetry.secretLab.counterSignature
            ? {
                counterSignature: telemetry.secretLab.counterSignature,
                ip: telemetry.secretLab.ip,
                requestParams: telemetry.secretLab.requestParams,
                result: telemetry.secretLab.result,
                timestamp: telemetry.secretLab.timestamp,
                url: telemetry.secretLab.url,
              }
            : {
                ip: telemetry.secretLab.ip,
                requestParams: telemetry.secretLab.requestParams,
                result: telemetry.secretLab.result,
                timestamp: telemetry.secretLab.timestamp,
                url: telemetry.secretLab.url,
              },
        }
      );
      await db
        .collection("telemetry-datas1")
        .updateOne({ _id: telemetry._id }, { $unset: { secretLab: "" } });
      console.log("count:", count);

      count = count + 1;
    }
    console.log("script ended>>>>>");
  } catch (e) {
    console.log(e, "error in script");
  }
});
