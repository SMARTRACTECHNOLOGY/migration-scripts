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
// var mongoDb = mongoose.createConnection("mongodb://127.0.0.1:27017/migrationSecretLab");
var mongoDb = mongoose.createConnection(
    "mongodb://sc-production-solution-cosmosdb:Ez36mJ2V6phUbj9kgSyJPQ0ycQuSbLx0wmVUMQZNqRVNbUlywQHPP01qEKEdNQddWHsxPXxiDirpACDbBFp3YA==@sc-production-solution-cosmosdb.mongo.cosmos.azure.com:10255/smartcosmos?ssl=true&replicaSet=globaldb&retrywrites=false"
  );
mongoDb.on('error', console.error.bind(console, 'connection error:'));

let dataArray = [{
    tenantData: "80a2b0ea-2915-42d1-9f7d-6cc88d6fa269",
    processData:"33021f99-17d8-4f02-b3c9-2b1c810e64ac"
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
             let count3 = 0

	     let array1 = [
  '045C9982286880', '04A49982286880',
  '048A9A82286880', '04849A82286880',
  '04A19982286880', '04499A82286880',
  '044F9A82286880', '04729A82286880',
  '048E9B82286880', '04889B82286880',
  '04629B82286880', '047D9C82286880',
  '04839C82286880', '04983AC2C96780',
  '046A3AC2C96780', '04459C82286880',
  '04699C82286880', '04409C82286880'
]
            
            let filterData = []
            // let filterData2 = []
             let remainingData = []
            enablementData.forEach((x)=>{
              if(array.includes(x.diId)){
                    filterData.push(x)
                // }else if(array2.includes(x.diId)){
                //     filterData2.push(x)
            }else{
                 remainingData.push(x)
               }
            })
        //     for (let data of filterData) {
        //         let inputData = []
        //         let x = {
        //             key:"Project",
        //             value: "Mock (15.6.2020)"
        //         }
        //         if(data.additionalData) {
        //            if(data.additionalData.addInput){
		// 	inputData = [...data.additionalData.addInput, x]
        //         }else{
		// 	inputData = [x]
		// }
		

        //         await mongoDb.collection("digitizedtags").updateOne({diId:data.diId},{ $set : {additionalData:  {...data.additionalData,
        //             addInput: inputData,
        //         }}}, {upsert:true});
        //         console.log(count++)
        //     }
	    // }
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
             for (let data of remainingData) {
                 let inputData = []
                 let x = {
                     key:"Project",
                     value: "SECRETLAB V2 (1.7.2020)"
                 }
                 if(data.additionalData) {
                   if(data.additionalData.addInput){
                        let projectIndex = data.additionalData.addInput.findIndex((y)=>y.key === "Project")
                         let temp = [...data.additionalData.addInput]
                         temp[projectIndex] = x
                         inputData = temp
                }else{
                        inputData = [x]
                }


                 await mongoDb.collection("projectUpdate2").updateOne({diId:data.diId},{ $set : {additionalData:  {...data.additionalData,
                     addInput: inputData,
                 }}}, {upsert:true});
                 console.log(count3++)
             }
	     } 
            console.log("succeffully run script", filterData.length, remainingData.length)
        }
        catch (e) {
            console.log("Error in tenant Data ", e)
        }
    }
})
