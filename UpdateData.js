const mongoose = require("mongoose");
// var uuid = require('uuid')   
 
console.log("Started the Script>>>>>>>>>>>>>>>>>>")
 
 
const lowercaseKeys = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase().trim()] = obj[key];
        return acc;
    }, {});
// new prod string url
var mongoDb = mongoose.createConnection('mongodb://127.0.0.1:27017/migration?authSource=admin?ssl=true&retryWrites=false');
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
            let enablementData = await mongoDb.collection("AuthTest").find({ "tenantId": { $eq: tenantId }, "processId": {$eq: processId} },).toArray();
            console.log(enablementData.length)
         
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
 
 
                await mongoDb.collection("AuthTest").updateOne({diId:data.diId},{ $set : {additionalData:  {
                    association: associationData,
                    addInput: inputData,
                    encode: '',
                }}}, {upsert:true});
            }
            console.log("succeffully run script")
        }
        catch (e) {
            console.log("Error in tenant Data ", e)
        }
    }
})