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
var mongoDb = mongoose.createConnection("mongodb://solution-dev-qamongo:HbylJkfMu8lwRwlAHOWqID9SY256BEnBO9Ulj0awumaJ6VETOOr6cAXu2Od6WQjg5QwOQEzI7ZerACDbyvkF0w==@solution-dev-qamongo.mongo.cosmos.azure.com:10255/smartcosmos_qa?ssl=true&retrywrites=false", { useNewUrlParser: true, useUnifiedTopology: true });
mongoDb.on('error', console.error.bind(console, 'connection error:'));

let dataArray = [{
    tenantData: "cff6c706-9b45-45ff-ba81-614b470bdb38",
    processData:"1c956416-8d09-46f0-8703-59ef95423ea3"
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
         
            for (let data of enablementData) {
                let barcode = []
                let qrcode = []
                let uhf = []
                let inputData = []
                if (data.diInfo.barcode.length>0) {
                    data.diInfo.barcode.map((i)=>{
                        barcode.push({
                                code: i.code,
                                type: 'barcode',
                                metaInfo: i
                            })  
                    })
                }
                else {
                    barcode = null
                }
                if (data.diInfo.qrcode.length > 0) {
                    data.diInfo.qrcode.map((i)=>{
                        qrcode.push({
                                code: i.code,
                                type: 'qrcode',
                                metaInfo:i
                            })  
                    })
                }
                else{
                    qrcode = null
                }
                if (data.diInfo.uhf.length > 0) {
                    data.diInfo.uhf.map((i)=>{
                        uhf.push({
                                code: i.epc,
                                type: 'uhf',
                                metaInfo: i
                            })  
                    })
                }
                else {
                    uhf = null
                }
                if(data.diInfo.input.length > 0) {
                    data.diInfo.input.map((i)=>{
                        inputData.push({
                              key: i.key,
                              value: i.value
                            })  
                    })
                }
                else {
                    inputData = null
                }

                let associationData = []
                if(barcode?.length > 0) {
                    associationData.push(...barcode)
                }if(qrcode?.length > 0) {
                    associationData.push(...qrcode)
                }if(uhf?.length > 0) {
                    associationData.push(...uhf)
                }


                await mongoDb.collection("digitizedtags").updateOne({diId:data.diId},{ $set : {additionalData:  {
                    association: associationData,
                    addInput: inputData,
                    encode: '',
                }, productDescription: data.diInfo.product.description}}, {upsert:true});
                console.log(count++)
            }
            console.log("succeffully run script")
        }
        catch (e) {
            console.log("Error in tenant Data ", e)
        }
    }
})