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









async function readTagData(newProdConnection) {

    console.log("Ready To Import Data from Current Production environement to New Production environment")
    limit = 5000;
    // getting distinct batch id
    let tagId = await newProdConnection.collection('matchData').distinct("diId");
    console.log("tagID data", tagId.length, new Date());
    for (let i = 0; i < tagId.length; i++) {
        console.log("New Tag ID :", tagId[i]);
        //calling batchId HashMap
        
        await newProdConnection.collection('digitizedtags').deleteMany({"diId":tagId[i]});
        console.log("Removed Tag ID =>",tagId[i])
        await delay(100);
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

    let newProd = await newProdConnection(mongoose);
    readTagData(newProd);
}
// calling main function 
main();