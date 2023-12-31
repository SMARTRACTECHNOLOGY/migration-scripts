var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ hosts: ['https://vpc-es-enablement-prod-new-d26vsrhl3dcz67u3swbpwxvpnu.eu-west-1.es.amazonaws.com'] });
var mongoose = require('mongoose');
mongoose.connect('/', { retryWrites: false });
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connection Successful!");

    //Client  for elastic search
    client.ping({
        requestTimeout: 30000,
    },
        function (error) {
            if (error) {
                console.error('Cannot connect to Elasticsearch.');
                console.error(error);

            } else {
                console.log('Connected to Elasticsearch was successful!');
            }
        })
    if (client) {

        client.search({
            index: 'enablements-gs1',
            type: '_doc',
            from: '0',
            size: '10000',
            body: {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "tenantId": "b529be14-2df8-42bd-806d-3a71d5790298"
                                }
                            },
                            {
                                "range": {
                                    "lastOperationTimestamp": {
                                        "gte": "2023-01-07T00:00-00:00",
                                        "lte": "2023-02-07T00:00-00:00"
                                    }
                                }
                            }
                        ]
                    }
                }
            }

        },
            function (error, response, status) {
                console.log("responsr", response)
                if (error) {
                    console.log("search error: " + error)
                }
                else {

                    let finalData = []
                    let enablementData;
                    let filteredData = [];

                    response.hits.hits.forEach(function (hit) {

                        //                         console.log("data come from elastic",hit._source)

                        enablementData = {

                            authentify: hit._source,

                        }

                        finalData.push(enablementData)
                    })

                    db.collection("secretLabs_backup").insertMany(finalData, function (err, res) {
                        if (err) throw err;
                        console.log("Inserted Successfully")
                        db.close();
                    })
                }
            });
    }
})