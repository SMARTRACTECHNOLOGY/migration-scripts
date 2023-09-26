    // let url = 'mongodb://diUser:6A200sj9ZlHjuXZHtIo2@sc-prod-new-di-database.cluster-ckpzwf1jxpvt.eu-west-1.docdb.amazonaws.com:27017/digital-identity?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
    // try {
    //     var oldProd = mongoose2.createConnection(url, { tlsCAFile: `rds-combined-ca-bundle.pem` });
    //     await oldProd.openUri(url);



    //     const mongoose = require("mongoose");

console.log("Started the Script>>>>>>>>>>>>>>>>>>");

const uri = 'mongodb://diUser:6A200sj9ZlHjuXZHtIo2@sc-prod-new-di-database.cluster-ckpzwf1jxpvt.eu-west-1.docdb.amazonaws.com:27017/digital-identity?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
mongoose.connect(uri, { tlsCAFile: `rds-combined-ca-bundle.pem` });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
  console.log("Connection Successful!");

  const chunkSize = 500;
  let documentsRemoved = 0;
  let continueRemoving = true;

  try {
    while (continueRemoving) {
      const collection = db.collection('Tag');
      const documents = await collection.find({ skey: null }).limit(chunkSize).toArray();

      if (documents.length === 0) {
        continueRemoving = false;
        break;
      }

      const documentIds = documents.map(doc => doc._id);
      const result = await collection.deleteMany({ _id: { $in: documentIds } });

      const deletedCount = result.deletedCount;
      documentsRemoved += deletedCount;

      if (deletedCount < chunkSize) {
        continueRemoving = false;
      }

      console.log(`Documents deleted in this iteration: ${deletedCount}`);
      console.log(`Total documents removed till now: ${documentsRemoved}`);

    }

    console.log(`Total documents removed: ${documentsRemoved}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    db.close();
  }
});