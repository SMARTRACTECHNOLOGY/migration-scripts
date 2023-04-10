const mongoose = require("mongoose");


// for new production
async function newProdConnection(mongoose1) {

    try {
        let url = 'mongodb://127.0.0.1:27017/smartcosmos_prod?authSource=admin';
        var newProd = mongoose1.createConnection();
        await newProd.openUri(url);
        newProd.on('error', console.error.bind(console, 'connection error:'));
        return newProd;
    } catch (error) {
        console.log(`\n\n\nSomething went wrong while connecting with MongoDB newProdConnection\n\n\n`, error.meggage);

    }
}

// creating connection from current production
async function currentProdConnection(mongoose2) {

    let url = "mongodb://127.0.0.1:27017/currentProduction?authSource=admin"
    try {
        var oldProd = mongoose2.createConnection();
        await oldProd.openUri(url);
        oldProd.on('error', console.error.bind(console, 'connection error:'));

        return oldProd;
    } catch (error) {
        console.log(`\n\n\nSomething went wrong while connecting with MongoDB currentProdConnection \n\n\n`, error.message);

    }
}





// creating customer HashMap
async function getCustomerHashMap(connection, batchId) {

    let customerHashMap = new Map();
    let restData = await connection.collection('CustomerBatch').find({ "batchId": batchId }).toArray();
    for (const data of restData) {
        // getting customer details
        let customer = await connection.collection('Customer').find({ "customerId": data.customerId }).toArray();
        let batchObject = {
            customerName: customer[0]?.customerName,
            deliveryDate: data?.deliveryDate,
            deliveryItemName: data?.deliveryItemName,
            deliveryQuantity: data?.deliveryQuantity,
            deliveryQuantityUnit: data?.deliveryQuantityUnit,
            historyReferenceId: data?.refOrderItemId,
            orderId: data?.orderId,
            orderDate: data?.orderDate,
            orderQuantity: data?.orderQuantity,
            orderQuantityUnit: data?.orderQuantityUnit,

        }
        customerHashMap.set(batchId, batchObject);

    }
    return customerHashMap;

}

async function readTagData(currentProdConnection, newProdConnection) {

    console.log("Ready To Import Data from Current Production environement to New Production environment")
    let counter = 0
    limit = 5000;
    let chunkSize01 = 1000;
    let chunkSize02 = 500;
    let chunkSize03 = 100;
    let fetchLimit=1000;
    let fetchLimitSkip=0;
    // getting distinct batch id
    //let batchData_ = await currentProdConnection.collection('Tag').distinct("bId");

    while (true) {

        let batchData_ = await currentProdConnection.collection('Tag').aggregate([
            { $sort: { "bId": 1 } },
            { $project: { "bId": 1 } },
            { $group: { "_id": "$bId" } },
            { $skip: fetchLimitSkip },
            { $limit: fetchLimit }
        ]).toArray();
       if(batchData_.length==0)
       {
        break;
       } 
        console.log("batchData_", batchData_.length, new Date());
        for (let i = 0; i < batchData_.length; i++) {
            let batchID = batchData_[i]._id;
           // checking batch id is exist in new collection or not  
           let checkExistingBatchId=await newProdConnection.collection('unassignedtagsdatas').find({batchId: batchID}).toArray();
           if(checkExistingBatchId.length>0)
            {
                continue;
            }       


            console.log("New Batch ID :", batchID);
            let bulkData = [];
            let offset = 0;
            //calling batchId HashMap
            let custumerData_ = await getCustomerHashMap(currentProdConnection, batchID)
            let custumerData = custumerData_.get(batchID)
            console.log(custumerData);

            while (true) {

                let localCounter = 0;
                let data_ = await currentProdConnection.collection('Tag').find({ "bId": batchID }).sort({ ct: 1 }).skip(offset).limit(limit).toArray();
                console.log("Total Record Found For BatchID=>", batchID, "Using Offest ", offset, "Data Found==>", data_.length)
                if (data_.length === 0) {
                    break;
                }
                for (const data of data_) {

                    const now = new Date();
                    const utcDatetime = now.toISOString().slice(0, 19) + '.000+00:00';

                    let final_data =
                    {
                        batchId: batchID,
                        tagId: data.htId,
                        secureKey: data.skey,
                        src: data.src,
                        customerName: custumerData?.customerName,
                        deliveryDate: custumerData?.deliveryDate,
                        deliveryItemName: custumerData?.deliveryItemName,
                        deliveryQuantity: custumerData?.deliveryQuantity,
                        deliveryQuantityUnit: custumerData?.deliveryQuantityUnit,
                        historyReferenceId: custumerData?.historyReferenceId,
                        orderId: custumerData?.orderId,
                        orderDate: custumerData?.orderDate,
                        orderQuantity: custumerData?.orderQuantity,
                        orderQuantityUnit: custumerData?.orderQuantityUnit,
                        createdAt: new Date(utcDatetime),
                    }

                    //  5100
                    // 0 < 500 && 5100 - 5000 > 500
                    if (bulkData.length < chunkSize01 && data_.length - localCounter > chunkSize01) {
                        bulkData.push(final_data);
                        counter++;
                        localCounter++
                        continue;

                    }
                    if (bulkData.length < chunkSize02 && data_.length - localCounter > chunkSize02) {
                        bulkData.push(final_data);
                        counter++;
                        localCounter++
                        continue;

                    }
                    if (bulkData.length < chunkSize03 && data_.length - localCounter > chunkSize03) {
                        bulkData.push(final_data);
                        counter++;
                        localCounter++
                        continue;

                    }


                    bulkData.push(final_data);
                    // insert into new production DB
                    await newProdConnection.collection('unassignedtagsdatas').insertMany(bulkData);
                    bulkData = [];
                    counter++;
                    localCounter++
                    console.log(bulkData.length, "<", chunkSize03, "&&", data_.length, "-", localCounter, ">", chunkSize03)
                    await delay(500);

                }

                offset = offset + data_.length;
                console.log("Total Inserted Records For Batch Id=> ", batchID, "LocalCounter===>", localCounter, " Total Inserted Records==>", counter, new Date());
                await delay(1000);

            }
        }
        fetchLimitSkip=fetchLimitSkip+batchData_.length;
    }
}


// for custum delay
const delay = (delayInms) => {
    console.log("DELAY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    return new Promise(resolve => setTimeout(resolve, delayInms));

}

// connection creation
// after successful connection start copying the data
async function main() {


    let currentProd = await currentProdConnection(mongoose);
    let newProd = await newProdConnection(mongoose);
    readTagData(currentProd, newProd);
}
// calling main function 
main();