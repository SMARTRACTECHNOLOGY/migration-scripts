
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
// c

let tenantArray = [
    {
        tenantData: {
            '86904681-eaa5-4b9e-aa49-6b6c4959481c': 'cff6c706-9b45-45ff-ba81-614b470bdb38'
        },
        process: {
            '4f9cd098-fc27-4736-b23f-971c3bff75ff': {
                id:'1c956416-8d09-46f0-8703-59ef95423ea3',
                input:['']
            },
            '9692f4e0-0837-434a-a7df-3eb212c791ea':{
                id:'fe515027-4c9f-4681-8619-ebda738af2b6',
                input:['']
            },
            "7830bc05-ac7d-453a-9ee3-965b604f78af":{
                id:'8e52f23e-18cf-4531-9452-6f1a4cd6b5c1',
                input:['']
            }
        },
        userId: {
            '3cf7ea6f-8245-4f6c-87f2-43ea28b372b8': {
                username: 'keri@authentify.art',
                id: "6f9b0992-f67e-4a22-bcc2-ef4430d9ae43"
            }
        },
        siteData: {
            '1bfd5bf6-f15e-430e-9652-3bd13fa97a73': {
                siteId: '60711ae8-f5af-4b5d-a6b1-173c3b5c45d9',
                zoneId: '41804d17-99c2-46b7-808e-edbdb1b895b3',

                siteName: 'AUTHENTIFY STILLWATER MINNESOTA LAB',
                zoneName: 'AUTHENTIFY STILLWATER MINNESOTA LAB_DEFAULT'
            },
        },
        deviceId: 'ce16e29a-7a1a-4fdd-ad8b-464b615e945e',
        deviceName: "Denso Device",
        product: {
            'Q3DzyjDArkF9Z': "b22f7e3c-06e7-40cf-9192-3d1399509b4d",
            "sxcJcne6K6vE7": "c0808ccd-841e-4b6b-b1b0-6a02261cb604",
            "sjNNWiGRvPyCJ": "8d29ec4a-7e6c-489a-abcc-65ebe1d5695b",
            "hxdXRpf7AKdzg":"f228c48b-1868-4d9c-a764-8e6a2cae074e",
            "ckGS7bmBZTa7r": "fefa7cfa-01a0-4332-8284-1d16523d2a39",
            "P5R4Y6hAChd6q": "15ecaee4-5d87-4d02-84c6-687b7b6441ed",
            "6utptZax6saw2": "4dbbe96d-f58f-4af7-b60c-0c4618952971",
            "TeCN9hF5zK8QE": "63a6f0ba-32e5-41cd-9dcd-7844216d48c2",
        }
    },
]
// let tenantArray = [
//     {
//         tenantData: {
//             '86904681-eaa5-4b9e-aa49-6b6c4959481c': 'cff6c706-9b45-45ff-ba81-614b470bdb38'
//         },
//         process: {
//             '4f9cd098-fc27-4736-b23f-971c3bff75ff': {
//                 id:'1c956416-8d09-46f0-8703-59ef95423ea3',
//                 input:['']
//             },
//             '9692f4e0-0837-434a-a7df-3eb212c791ea':{
//                 id:'fe515027-4c9f-4681-8619-ebda738af2b6',
//                 input:['']
//             },
//             "7830bc05-ac7d-453a-9ee3-965b604f78af":{
//                 id:'8e52f23e-18cf-4531-9452-6f1a4cd6b5c1',
//                 input:['']
//             }
//         },
//         userId: {
//             '3cf7ea6f-8245-4f6c-87f2-43ea28b372b8': {
//                 username: 'Keri@authentify.Art',
//                 id: "6f9b0992-f67e-4a22-bcc2-ef4430d9ae43"
//             }
//         },
//         siteData: {
//             '1bfd5bf6-f15e-430e-9652-3bd13fa97a73': {
//                 siteId: '1bfd5bf6-f15e-430e-9652-3bd13fa97a73',
//                 zoneId: '41804d17-99c2-46b7-808e-edbdb1b895b3',

//                 siteName: 'AUTHENTIFY STILLWATER MINNESOTA LAB',
//                 zoneName: 'AUTHENTIFY STILLWATER MINNESOTA LAB_DEFAULT'
//             },
//         },
//         deviceId: 'b5b32b82-5da0-41c7-9488-414c8e06a711',
//         deviceName: "Denso Device",
//         product: {
//             'Q3DzyjDArkF9Z': "b22f7e3c-06e7-40cf-9192-3d1399509b4d",
//             "sxcJcne6K6vE7": "c0808ccd-841e-4b6b-b1b0-6a02261cb604",
//             "sjNNWiGRvPyCJ": "8d29ec4a-7e6c-489a-abcc-65ebe1d5695b",
//             "hxdXRpf7AKdzg": "f228c48b-1868-4d9c-a764-8e6a2cae074e",
//             "ckGS7bmBZTa7r": "fefa7cfa-01a0-4332-8284-1d16523d2a39",
//             "P5R4Y6hAChd6q": "15ecaee4-5d87-4d02-84c6-687b7b6441ed",
//             "6utptZax6saw2": "4dbbe96d-f58f-4af7-b60c-0c4618952971",
//             "TeCN9hF5zK8QE":"63a6f0ba-32e5-41cd-9dcd-7844216d48c2",

//         }
//     },
// ]


mongoDb.once('open', async function () {
    for (let tenantData of tenantArray) {
        try {
            let tenantId = Object.keys(tenantData.tenantData)

            let enablementData = await mongoDb.collection("authen").find({ "authentify.tenantId": { $eq: tenantId[0] } },).toArray();

            // Product Logic
            let enableBulk = []
            let filteredData = []
            let duplicates = []
            let duplicatesArray = []
            for (let enbleData of enablementData) {
                let dataTrim = enbleData.authentify.metadata.product;
                let check;
                if (enbleData.authentify?.metadata?.product?.sku != undefined) {
                    console.log("<<<<>>>>", enbleData.authentify.metadata.product.sku, "   Count ", i)

                }
                if (dataTrim !== undefined && dataTrim !== null) {
                    check = lowercaseKeys(dataTrim)
                }
                enbleData.authentify.metadata.product = check;
            }
            console.log("Tenant Enablement Data >>>>>", enablementData.length)
            for (let enbleData of enablementData) {
                let product
                let id 
                let url
                let type
                let siteId, siteName, userId, username
                let zoneId, zoneName, newprocessId, productId, inputData=[]
                let upc = enbleData.authentify.metadata?.product?.upc
                if (upc) {

                    product = upc
                }
                let sku = enbleData.authentify.product?.sku
                if(sku) {
                    product = sku

                }
                else{
                    product = enbleData.authentify.metadata?.product?.barcode
                }
                let barcode =[]
                let qrcode =[]
                let uhf = []
                if (enbleData.authentify.metadata.barcode.length>0) {
                    enbleData.authentify.metadata.barcode.map((i)=>{
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
                if (enbleData.authentify.metadata.qrcode.length > 0) {
                    enbleData.authentify.metadata.qrcode.map((i)=>{
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
                if (enbleData.authentify.metadata.uhf.length > 0) {
                    enbleData.authentify.metadata.uhf.map((i)=>{
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
                if(enbleData.authentify.metadata.input.length > 0) {
                    enbleData.authentify.metadata.input.map((i)=>{
                        inputData.push({
                              key: i.key,
                              value: i.value
                            })  
                    })
                }
                else {
                    inputData = null
                }
                //Primary URL>>>>>>>>>>>..
                // console.log('barcode',barcode)
                if (enbleData.authentify.nfc.length > 0) {
                    url = enbleData.authentify.metadata?.nfc[0].url
                    id = enbleData.authentify.metadata?.nfc[0].id
                    type = "nfc"

                } else if (enbleData.authentify.uhf.length > 0) {
                    url = enbleData.authentify.metadata?.uhf[0].url
                    id = enbleData.authentify.metadata?.uhf[0].id
                    type = "uhf"
                } else if (enbleData.authentify.barcode.length > 0) {
                    url = enbleData.authentify.metadata?.barcode[0].url
                    id = enbleData.authentify.metadata?.barcode[0].id
                    type = "barcode"
                } else {
                    url = enbleData.authentify.metadata?.qr[0].url
                    id = enbleData.authentify.metadata?.qr[0].id
                    type = "qr"
                }

                // Site Data
                Object.keys(tenantData.siteData).filter(item => {
                    item === enbleData.authentify.factory.id,
                        siteId = tenantData.siteData[item]?.siteId,
                        zoneId = tenantData.siteData[item]?.zoneId,
                        siteName = tenantData.siteData[item]?.siteName,
                        zoneName = tenantData.siteData[item]?.zoneName
                })

                // User Data
                Object.keys(tenantData.userId).filter(user => {
                    user === enbleData.authentify.lastOperator.id,
                        userId = tenantData.userId[user]?.id,
                        username = tenantData.userId[user]?.username
                })

                // User Process
                Object.keys(tenantData.process).filter(processData => {
                    if(processData === enbleData.authentify.processId){
                        console.log("processData>>>>",enbleData.authentify.processId,processData)
                        newprocessId = tenantData.process[processData].id
                    }
                     
                })
                Object.keys(tenantData.product).filter(productUpc => {
                    console.log("Product>>>>",product)
                    productUpc === product,
                        productId = tenantData.product[product]
                })



                let Statas = enbleData.authentify.status
                let associationData = []
                if(barcode.length > 0) {
                    associationData.push(...barcode)
                }if(qrcode?.length > 0) {
                    associationData.push(...qrcode)
                }if(uhf?.length > 0) {
                    associationData.push(...uhf)
                }
                let enaleObj = {
                    tenantId: tenantData.tenantData[tenantId],
                    userId: userId,
                    userName: username,
                    processId: newprocessId,
                    processType: 'Digitization',
                    productId: productId,
                    productExperienceId: enbleData.authentify.metadata?.product?.experienceid,
                    productExperienceStudioId: enbleData.authentify.metadata?.product?.experiencestudioid,
                    productExperienceTenantId: enbleData.authentify.metadata?.product?.experiencetenantid,
                    productUPC: product,
                    status: Statas.toLowerCase(),
                    deviceId: tenantData.deviceId,
                    deviceName: tenantData.deviceName,
                    siteId: siteId,
                    zoneId: zoneId,
                    additionalData:
                    {
                        association: associationData,
                        addInput: inputData,
                        encode: '',

                    },
                    siteName: siteName,
                    zoneName: zoneName,
                    diId: id,
                    diInfo: enbleData.authentify?.metadata,
                    primaryURL: url,
                    primaryId: id,
                    primaryIdType: type,
                    productDescription: '',
                    count: '',
                    chunkIdentifier: '',
                    finalChunk: '',
                    fileUrl: '',
                    operationTime: enbleData.authentify?.lastOperationTimestamp,
                    createdAt: enbleData.authentify?.activationTimestamp,
                    lastUpdatedAt: enbleData.authentify?.activationTimestamp,

                }
                enableBulk.push(enaleObj)
            }
            console.log(enableBulk[0].additionalData)
            let uniqueData = [...new Map(enableBulk.map(item => [item['diId'], item])).values()]
            uniqueData.forEach((item) => {

                // find list of duplicates items
                duplicates = enableBulk.filter(x => x?.diId === item?.diId);

                // find item which has least time

                let result = duplicates.reduce(function (prev, curr) {
                    return prev.createdAt < curr.createdAt ? prev : curr;
                });
                filteredData.push(result);
                duplicatesArray.push(duplicates)
            })
            console.log(filteredData.length, filteredData[0])
            let unAssignedTag = await mongoDb.collection("Qa_Authentify_test").insertMany(filteredData);
        } catch (err) {
            console.log("Error in tenant Data ", err)
        }
        // to inser in monodb
    }


    console.log("End Of Script>>>>>>>>>>>>>>>>>>>>>>")

})


