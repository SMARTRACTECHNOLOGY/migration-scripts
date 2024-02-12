const mongoose = require('mongoose');
var mongoDb = mongoose.createConnection('mongodb://127.0.0.1:27017/UserManagement');

mongoDb.on('error', console.error.bind(console, 'connection error:'))

console.log("connection pass>>>>>>>>>")


mongoDb.once('open', async function () {
    // const processId = "9925a1d4-d39d-4876-85dc-49b16c850c56"
    // const newProcessId = '314b356b-80ce-4431-96ab-e25ea07ef4f3';

    const processId = "c88651fa-13c4-4a9f-87e7-72031ddf6716"
    const newProcessId = "d43a8041-e74c-4d3a-b155-ea2d033af05d"
    const didata =  await mongoDb.collection("data").updateMany({processId: processId}, {$set : {processId: newProcessId}}, {upsert:true})
    console.log(">>>>>>>>>>>>>>>>>")

})




