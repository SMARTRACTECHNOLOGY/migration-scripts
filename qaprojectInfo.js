const mongoose = require("mongoose");
// var uuid = require('uuid')   

console.log("Started the Script>>>>>>>>>>>>>>>>>>")


const lowercaseKeys = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase().trim()] = obj[key];
        return acc;
    }, {});
// new prod string url
// var mongoDb = mongoose.createConnection('mongodb://127.0.0.1:27017/smartcosmos?authSource=admin?ssl=true&retryWrites=false');
var mongoDb = mongoose.createConnection("mongodb://solution-dev-qamongo:HbylJkfMu8lwRwlAHOWqID9SY256BEnBO9Ulj0awumaJ6VETOOr6cAXu2Od6WQjg5QwOQEzI7ZerACDbyvkF0w==@solution-dev-qamongo.mongo.cosmos.azure.com:10255/smartcosmos_qa?ssl=true&retrywrites=false");
mongoDb.on('error', console.error.bind(console, 'connection error:'));

let dataArray = [{
    tenantData: "42ed8a64-53c1-4b49-91d3-7bc008336180",
    processData:"5aff1125-1bbc-4916-9c76-cda38b0fe76a"
}]

mongoDb.once("open", async function () {
    for (let tenant of dataArray) {
        try {
            let tenantId = tenant.tenantData
            let processId = tenant.processData
            console.log(tenantId)
            let enablementData = await mongoDb.collection("digitizedtags").find({ "tenantId": { $eq: tenantId }, "processId": {$eq: processId} },).toArray();
            console.log(enablementData.length)
            let count = 0
            // let count2 = 0
            // let count3 = 0

            // let filterData = []
            // let filterData2 = []
            // let remainingData = []
            // enablementData.forEach((x)=>{
            //     if(array.includes(x.diId)){
            //         filterData.push(x)
            //     // }else if(array2.includes(x.diId)){
            //     //     filterData2.push(x)
            //     // }else{
            //     //     remainingData.push(x)
            //     }
            // })
            for (let data of enablementData) {
                let inputData = []
                let x = {
                    key:"Project",
                    value: "TEST TAGS"
                }
                if(data.additionalData) {
                   inputData = [...data.additionalData.addInput, x]
                }

                await mongoDb.collection("digitizedtags").updateOne({diId:data.diId},{ $set : {additionalData:  {...data.additionalData,
                    addInput: inputData,
                }}}, {upsert:true});
                console.log(count++)
            }
            // for (let data of filterData2) {
            //     let inputData = []
            //     let x = {
            //         key:"Project",
            //         value: "SECRETLAB_V3_2022_TEST"
            //     }
            //     if(data.additionalData) {
            //        inputData = [...data.additionalData.addInput, x]
            //     }

            //     await mongoDb.collection("projectUpdate2").updateOne({diId:data.diId},{ $set : {additionalData:  {...data.additionalData,
            //         addInput: inputData,
            //     }}}, {upsert:true});
            //     console.log(count2++)
            // }
            // for (let data of remainingData) {
            //     let inputData = []
            //     let x = {
            //         key:"Project",
            //         value: "SECRETLAB_2022_240521"
            //     }
            //     if(data.additionalData) {
            //        inputData = [...data.additionalData.addInput, x]
            //     }

            //     await mongoDb.collection("projectUpdate2").updateOne({diId:data.diId},{ $set : {additionalData:  {...data.additionalData,
            //         addInput: inputData,
            //     }}}, {upsert:true});
            //     console.log(count3++)
            // }
            // console.log("succeffully run script", filterData)
        }
        catch (e) {
            console.log("Error in tenant Data ", e)
        }
    }
})