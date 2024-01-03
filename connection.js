const mongoose = require("mongoose");
console.log("Started the Script>>>>>>>>>>>>>>>>>>")
// old prod string url
const uri = 'mongodb://diUser:6A200sj9ZlHjuXZHtIo2@sc-prod-new-di-database.cluster-ckpzwf1jxpvt.eu-west-1.docdb.amazonaws.com:27017/digital-identity?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
var oldDB = mongoose.createConnection(uri, { tlsCAFile: `global-bundle.pem` });

oldDB.once('open', async function () {
    console.log("Connection successfull")
    let allTags = await oldDB.collection("Tag").find().toArray()
    console.log("All Tags present in old DB:",allTags.length)
})