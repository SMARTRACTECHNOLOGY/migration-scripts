const mongoose = require("mongoose");
var uuid = require('uuid')
console.log("Started the Script>>>>>>>>>>>>>>>>>>")
// old prod string url
const uri = 'mongodb://diUser:6A200sj9ZlHjuXZHtIo2@sc-prod-new-di-database.cluster-ckpzwf1jxpvt.eu-west-1.docdb.amazonaws.com:27017/digital-identity?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
var oldDB = mongoose.createConnection(uri, { tlsCAFile: `global-bundle.pem` });
oldDB.on('error', console.error.bind(console, 'connection error:'));
// new prod string url
var qaDB = mongoose.createConnection('mongodb://solution-dev-qamongo:HbylJkfMu8lwRwlAHOWqID9SY256BEnBO9Ulj0awumaJ6VETOOr6cAXu2Od6WQjg5QwOQEzI7ZerACDbyvkF0w==@solution-dev-qamongo.mongo.cosmos.azure.com:10255/smartcosmos_qa?ssl=true&retrywrites=false');;
qaDB.on('error', console.error.bind(console, 'connection error:'));
oldDB.once('open', async function () {
    console.log("Connection Successful!");
    // manufacture data object
    let batchIdWithNoTag = []
    console.log(batchIdWithNoTag,"batch id with no tag")
    let costumerdistinctBatchId = await oldDB.collection("CustomerBatch").distinct("batchId")
    console.log(costumerdistinctBatchId, "new costumer distinct batch>>>")
    let newDistinctBatchIds = await qaDB.collection("uninsertBatch").distinct("batchId")
 
    //This array will have data of costumer batches
    let remainCostumerBatch = costumerdistinctBatchId.filter(x => !newDistinctBatchIds.includes(x))
    //This array will have data of costumer batches
    let totalInserted = 0
    
    for (let batch of remainCostumerBatch) {
        let chunksize = 1000
        let limit = 0
        let bulkDataObj = []
        let diBulkDataObj = []
        let custBT = new Date().getTime()
        let customerBatchData = await oldDB.collection("CustomerBatch").findOne({ 'batchId': batch });
        console.log("customers BatchData ", new Date().getTime() - custBT, batch)
 
        let custBT2 = new Date().getTime()
        let customerData = await oldDB.collection("Customer").findOne({ 'customerId': customerBatchData.customerId });
        console.log("customers  ", new Date().getTime() - custBT2)
        // let ct = 0 // Use to count Inserted tags per batchId
        let custBT3 = new Date().getTime()
 
        let tagsData1 = await oldDB.collection("Tag").find({ bId: batch }).toArray();
        console.log("TagData", new Date().getTime() - custBT3, tagsData1.length) //1000
        if (tagsData1.length <= 0) {
            await qaDB.collection("uninsertBatch").insertOne({
                batchId: batch,
                tagsLength: tagsData1.length
            })
            console.log("BatchId with No Tag data", batchIdWithNoTag.length)
            continue;
        }
        console.log("after uninsertbatch>>>>>>")
        // Tag Id per batchId
        while (true) {
            let tagsData = await oldDB.collection("Tag").find({ bId: batch }).skip(limit).limit(chunksize).toArray();
            let ct = 0
            console.log("TagData", new Date().getTime() - custBT3, tagsData1.length)
            if (tagsData.length <= 0) {
                console.log("on breaking loop", limit, chunksize, batch)
                break;
            }
            let tagIds = tagsData.map(i => i._id)
            // return Promise.all(tagIds).then(bulkDataInsertionFunction(tagIds))
            await bulkDataInsertionFunction(tagIds)
            // BULK INSERT FUNCTION>>>>>>>>>>>>>>>>>>>.
            async function bulkDataInsertionFunction(tagIds) {
                let diCt = new Date().getTime()
                let distinctDigitizedData = await qaDB.collection("digitizedtags").find({ diId: { $in: tagIds } }).toArray();
                console.log("distinctDigitizedData Time", distinctDigitizedData, new Date().getTime() - diCt,)
                let digitizedTagData = []
                let unDigitizedTagData = []
                console.log("undigitized tags>>>>>>>>>>>", unDigitizedTagData)
                let batchDataObj = {}
                let mapCt = new Date().getTime()
                let result = tagsData.map(ele => {
                    //   let batchDataObj = {}
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
                    
                    if (distinctDigitizedData.length > 0) {
                        console.log("digitize data found", distinctDigitizedData.length )
                        let data = distinctDigitizedData.find(i => i.diId === ele._id)
                        if (data) {
                        console.log("this tag is digitize", ele._id)
                            dataObj.tenantId = data.tenantId;
                            dataObj.tenantName = data.tenantName;
                            dataObj.tagId = ele._id;
                            dataObj.batchId = ele.bId;
                            dataObj.secureKey = ele.seq;   // doubt
                            dataObj.tagType = ele.ttl;    // doubt
                            batchDataObj.batchId = ele.bId;
                            dataObj.historyReferenceId = uuid.v4();
                            dataObj.status = data?.status == "enabled"? "Active" : "Inactive";
                            dataObj.isActivated = true;
                            digitizedTagData.push(dataObj)
                            dataObj = null
                        }else{
                        console.log("this tag is undigitize", ele._id)
                            dataObj.tenantId = distinctDigitizedData[0].tenantId;
                            dataObj.tenantName = distinctDigitizedData[0].tenantName;
                            dataObj.tagId = ele._id;
                            dataObj.batchId = ele.bId;
                            dataObj.secureKey = ele.seq;   // doubt
                            dataObj.tagType = ele.ttl;    // doubt
                            batchDataObj.batchId = ele.bId;
                            dataObj.historyReferenceId = uuid.v4();
                            dataObj.status = 'Inactive';
                            dataObj.isActivated = true;
                            digitizedTagData.push(dataObj)
                            dataObj = null
                        }
                    } else {
                        console.log("digitize tag is not found", ele._id)
                        dataObj.tagId = ele._id;
                        dataObj.batchId = ele.bId;
                        dataObj.secureKey = ele.seq;   // doubt
                        dataObj.tagType = ele.ttl;    // doubt
                        batchDataObj.batchId = ele.bId;
                        dataObj.historyReferenceId = uuid.v4();
                        // let restdata = {...dataObj,_id}
                        unDigitizedTagData.push(dataObj)
                        // console.log(batchDataObj)
                        dataObj = null
                    }
                })
                console.log("Map per Batch", batchDataObj, new Date().getTime() - mapCt)
                return Promise.all(result).then(async () => {
                    console.log('DigitizedData length', digitizedTagData.length, "UnDegitized data length", unDigitizedTagData.length)
                    //     let batchDataObj = {}
                    if (digitizedTagData.length) {
                        console.log('digitize data', digitizedTagData[0])
                        // for (let ditag of digitizedTagData) {
                        for (let i = 0; i < digitizedTagData.length; i += 100) {
                            try {
                                delete digitizedTagData[i]._id
                                batchDataObj.historyReferenceId = uuid.v4();
                                batchDataObj.tenantId = digitizedTagData[i].tenantId;
                                batchDataObj.tenantName = digitizedTagData[i].tenantName;
                                batchDataObj.status = digitizedTagData[i].status;
                                diBulkDataObj = digitizedTagData.slice(i, i + 100)
                                console.log("Add Data in DI Bulk > 500 >>>>>>>>>>>>>>>>>>>>", bulkDataObj.length)
                                let manufactureData = await qaDB.collection("manufacturetags1").insertMany(diBulkDataObj);
                                console.log("Insert in Manufacture", manufactureData);
                                await qaDB.collection("batches1").updateOne({ batchId: batchDataObj.batchId }, { $set: batchDataObj }, { upsert: true })
                                totalInserted = totalInserted + diBulkDataObj.length
                                console.log("Tag Inserted  in digitized tags for BatchId ", batch, ct, "out of ", tagsData.length, "and total Inserted", totalInserted);
                                diBulkDataObj = []
                            } catch (e) {
                                console.log("Error in inserting DI data", e)
                                break;
                            }
                    }
                }
                        if (unDigitizedTagData.length) {
                            console.log('Undigitize data', unDigitizedTagData[0], batchDataObj)
                            for (let i = 0; i < unDigitizedTagData.length; i += 100) {
                                try {
                                    delete unDigitizedTagData[i]._id
                                    bulkDataObj = unDigitizedTagData.slice(i, i + 100)
                                    console.log("Add Data in Bulk > 500 >>>>>>>>>>>>>>>>>>>>", bulkDataObj.length)
                                    console.log(bulkDataObj.length, "bulkdata before insertion")
                                    let unAssignedTag = await qaDB.collection("unassignedtags1").insertMany(bulkDataObj);
                                    await qaDB.collection("unassignedBatch1").updateOne({ batchId: batchDataObj.batchId }, { $set: batchDataObj }, { upsert: true })
                                    ct = ct + bulkDataObj.length
                                    totalInserted = totalInserted + bulkDataObj.length
                                    console.log("Tag Inserted  in  Unassignedtags for BatchId ", batch, unAssignedTag.length, "out of ", unDigitizedTagData.length, "and total Inserted", totalInserted);
                                    bulkDataObj = []
                                } catch (err) {
                                    console.log("error in Undigitized data Insertion >>>", err)
                                    break;
                                }
                            }
                        }
                        return
                    });
            }
            limit = limit + tagsData.length
        }
        //      batchDataObj=null
    }
    //For costumer batch data
    console.log("script ended>>>>>>>>>>>>")
})

