const mongoose = require("mongoose");
var mongoDb = mongoose.createConnection('mongodb://127.0.0.1:27017/migrationSecretLab?authSource=admin?ssl=true&retryWrites=false');
mongoDb.on('error', console.error.bind(console, 'connection error:'));

mongoDb.once('open', async function () {
        let data = await (await mongoDb.collection("janSecretLa").distinct("secretLab.metadata.nfc.id"))
        console.log(data.length)
})