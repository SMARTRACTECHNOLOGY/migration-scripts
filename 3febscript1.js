const mongoose = require("mongoose");
var uuid = require('uuid')
 
console.log("Started the Script>>>>>>>>>>>>>>>>>>")
 
// old prod string url
const uri = 'mongodb://diUser:6A200sj9ZlHjuXZHtIo2@sc-prod-new-di-database.cluster-ckpzwf1jxpvt.eu-west-1.docdb.amazonaws.com:27017/digital-identity?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
var oldDB = mongoose.createConnection(uri, { tlsCAFile: `rds-combined-ca-bundle.pem` });
 
oldDB.on('error', console.error.bind(console, 'connection error:'));
 
 
// new prod string url
var qaDB = mongoose.createConnection('mongodb://sc-prod-solution-mongo:nYjrrse41tiuZKX7b1VJFXj7nfU4MshzwdSLJNHPfmHmzZXXCptl7qXHH8CPwxGEX3gZGKRI6k4kACDbGdiVaA==@sc-prod-solution-mongo.mongo.cosmos.azure.com:10255/smartcosmos?ssl=true&retryWrites=false');
qaDB.on('error', console.error.bind(console, 'connection error:'));
 
 
oldDB.once('open', async function () {
    console.log("Connection Successful!");
    // manufacture data object
 
    let distinctBatchId = await oldDB.collection("CustomerBatch").distinct("batchId")
    let newDistinctBatchIds = await qaDB.collection("unassignedBatch").distinct("batchId")
    // let remainBatch = distinctBatchId.filter(x => !newDistinctBatchIds.includes(x))
    let remainBatch=['0004038273']
    console.log("DistinctBatchId======================>", remainBatch.length)
    let totalInserted = 0
    for (let batch of remainBatch) {
        let bulkDataObj = []
        let diBulkDataObj = []
 
        let custBT = new Date().getTime()
        let customerBatchData = await oldDB.collection("CustomerBatch").findOne({ 'batchId': batch });
        console.log("Customer BatchData ", new Date().getTime() - custBT, batch)
 
 
        let custBT2 = new Date().getTime()
        let customerData = await oldDB.collection("Customer").findOne({ 'customerId': customerBatchData.customerId });
        console.log("Customer  ", new Date().getTime() - custBT2)
        let ct = 0 // Use to count Inserted tags per batchId
 
        let custBT3 = new Date().getTime()
        let tagsData = await oldDB.collection("Tag").find({ bId: batch }).toArray();
        console.log("TagData", new Date().getTime() - custBT3, tagsData.length) //1000
 
        if(tagsData.length <= 0){
            continue;
        }
        // Tag Id per batchId
        let tagIds = tagsData.map(i => i._id)
 
 
        let diCt = new Date().getTime()
        let distinctDigitizedData = await qaDB.collection("digitizedtags").find({ diId: { $in: tagIds } }).toArray();
        console.log("distinctDigitizedData Time",distinctDigitizedData,new Date().getTime()-diCt,)
 
 
        let digitizedTagData = []
        let unDigitizedTagData = []
 
        let dataObj = {
            userId: "",
            userName: "",
            manufacturerName: "",
            customerName: "",
            fileName: "",
            batchId: "",
            tagId: "",
            tagInfo: "",
            tagType: "",    //dount
            tagClass: "",
            hash: "",
            secureKey: "",   //doubt
            inlayItemName: "",
            inlayType: "",
            vendorName: "",
            orderId: "",
            orderDate: "",
            orderQuantity: "",
            orderQuantityUnit: "",
            deliveryDate: "",
            deliveryItemName: "",
            deliveryQuantity: "",
            deliveryQuantityUnit: "",
            historyReferenceId: "",
            status: 'Inactive',
            isActivated: false,
            operationTime: new Date(),
            lastValidCounter: '000000'
        };
 
        dataObj.orderId = customerBatchData.orderId;
        dataObj.orderDate = customerBatchData.orderDate;
        dataObj.orderQuantity = customerBatchData.orderQuantity;
        dataObj.orderQuantityUnit = customerBatchData.orderQuantityUnit;
        dataObj.deliveryDate = customerBatchData.deliveryDate;
        dataObj.deliveryItemName = customerBatchData.deliveryItemName;
        dataObj.deliveryQuantity = customerBatchData.deliveryQuantity;
        dataObj.deliveryQuantityUnit = customerBatchData.deliveryQuantityUnit;
        dataObj.inlayItemName = customerBatchData.batchProperties.inlayItemName;
        dataObj.inlayType = customerBatchData.batchProperties.inlayType;
        dataObj.customerName = customerData.customerName;
        dataObj.manufacturerName = customerData.customerName;
 
 
        let mapCt = new Date().getTime()
        let result = tagsData.map(ele => {
            if (distinctDigitizedData.find(i => i.diId === ele._id)) {
                let data = distinctDigitizedData.find(i => i.diId === ele._id)
                if(data){
                    dataObj.tenantId = data.tenantId;
                    dataObj.tenantName = data.tenantName;
                    dataObj.tagId = ele._id;
                    dataObj.batchId = ele.bId;
                    dataObj.secureKey = ele.seq;   // doubt
                    dataObj.tagType = ele.ttl;    // doubt
                  //  batchDataObj.batchId = ele.bId;
                    dataObj.historyReferenceId = uuid.v4();
                    dataObj.status = 'active';
                    dataObj.isActivated = true;
                    delete dataObj._id
                    digitizedTagData.push(dataObj)
                }
 
            } else {
                delete dataObj._id
                dataObj.tagId = ele._id;
                dataObj.batchId = ele.bId;
                dataObj.secureKey = ele.seq;   // doubt
                dataObj.tagType = ele.ttl;    // doubt
                //batchDataObj.batchId = ele.bId;
                dataObj.historyReferenceId = uuid.v4();
                unDigitizedTagData.push(dataObj)
            }
 
        })
        console.log("Map per Batch",new Date().getTime()-mapCt)
 
 
        Promise.all(result).then(() => {
		let batchDataObj ={}
            console.log('DigitizedData length', digitizedTagData.length, "UnDegitized data length", unDigitizedTagData.length)
            if (digitizedTagData.length) {
                console.log('digitize data', digitizedTagData[0])
 
                for (let ditag of digitizedTagData) {
                    batchDataObj.historyReferenceId = uuid.v4();
                    batchDataObj.tenantId = ditag.tenantId;
                    batchDataObj.tenantName = ditag.tenantName;
                    batchDataObj.status = 'Active';
			batchDataObj.batchId = ele.bId;
                    if (diBulkDataObj.length < 500 && tagsData.length - ct > 500) {
                            diBulkDataObj.push(ditag)
                            console.log("Add Data in Di Bulk remaining is > 500 >>>>>>>>>>>>>>>>>>>>", diBulkDataObj.length)
                            continue;
 
                    } else if (tagsData.length - ct <= 500 && tagsData.length !== ct + diBulkDataObj.length) {
                        diBulkDataObj.push(ditag)
                        console.log("Add Data in Di Bulk remaining is < 500 >>>>>>>>>>>>>>>>>>>>", diBulkDataObj.length)
                        continue;
                    }
 
                    // let manufactureData = await qaDB.collection("manufacturertags").insertMany(diBulkDataObj);
                    // console.log("Insert in Manufacture", manufactureData);
 
                    // await qaDB.collection("batches").updateOne({ batchId: batchDataObj.batchId }, { $set: batchDataObj }, { upsert: true })
                    ct = ct + diBulkDataObj.length
                    totalInserted = totalInserted + diBulkDataObj.length
 
                    console.log("Tag Inserted  in digitized tags for BatchId ", batch, ct, "out of ", tagsData.length, "and total Inserted", totalInserted);
                }
            }
 
            if (unDigitizedTagData.length) {
                console.log('Undigitize data', unDigitizedTagData[0])
                const originalUndigitizedlenght = unDigitizedTagData.length
		    let size = 500
                for (i=0 ; i< originalUndigitizedlenght;i+=size) {
                //    let totalUnDigitized  = unDigitizedTagData.length
                    console.log("For i =",i,originalUndigitizedlenght )
                    //if (totalUnDigitized > 500) {
		//	console.log("Inside the >500",)
                        bulkDataObj = unDigitizedTagData.slice(i, i+size)
                    //    i = i+500
                    //} else {
                      //  bulkDataObj = unDigitizedTagData
                       // i = unDigitizedTagData.length
                   // }
 
                    console.log("Inserting bulkDataObj with lenght",bulkDataObj.length)
 
                // let unAssignedTag = await qaDB.collection("unassignedTags").insertMany(bulkDataObj);
 
                }
 
 
 
 
 
                // for (let undiTag of unDigitizedTagData) {
                //     if (bulkDataObj.length < 500 && unDigitizedTagData.length - ct > 500) {
                //             bulkDataObj.push(undiTag)
                //             console.log("Add Data in Bulk > 500 >>>>>>>>>>>>>>>>>>>>", bulkDataObj.length)
                //             continue;
 
                //     } else if (unDigitizedTagData.length - ct <= 500 && unDigitizedTagData.length !== ct + bulkDataObj.length) {
                //         bulkDataObj.push(undiTag)
                //         console.log("Add Data in  Bulk < 500 >>>>>>>>>>>>>>>>>>>>", bulkDataObj.length)
                //         continue;
                //     }
 
                //     bulkDataObj.push(undiTag)
                //     let insertCt = new Date().getTime()
                //     // let unAssignedTag = await qaDB.collection("unassignedTags").insertMany(bulkDataObj);
                //     // console.log("Insert in unassignedTags", unAssignedTag, ct, new Date().getTime() - insertCt,);
 
                //     const st = new Date().getTime()
                //     // await qaDB.collection("unassignedBatch").updateOne({ batchId: batchDataObj.batchId }, { $set: batchDataObj }, { upsert: true })
                //     console.log("Insert in unassignedBatch with upsert  >>>>>>>>>>>>>>>>>>>>>>>>>>>>", new Date().getTime() - st)
 
                //     ct = ct + bulkDataObj.length
                //     totalInserted = totalInserted + bulkDataObj.length
                //     console.log("Tag Inserted  in  Unassignedtags for BatchId ", batch, ct, "out of ", unDigitizedTagData.length, "and total Inserted", totalInserted);
                //     bulkDataObj = []
 
                // }
            }
 
        });
 
    }
 
})