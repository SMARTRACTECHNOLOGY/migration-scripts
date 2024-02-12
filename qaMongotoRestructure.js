
const mongoose = require("mongoose");
// var uuid = require('uuid')   

console.log("Started the Script>>>>>>>>>>>>>>>>>>")


const lowercaseKeys = obj =>
    Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase().trim()] = obj[key];
        return acc;
    }, {});
// new prod string url
var mongoDb = mongoose.createConnection('mongodb://127.0.0.1:27017/local?authSource=admin?ssl=true&retryWrites=false');
mongoDb.on('error', console.error.bind(console, 'connection error:'));
// c

let tenantArray = [
    {
      tenantData: {
        "86904681-eaa5-4b9e-aa49-6b6c4959481c":
          "c2107b22-b02e-45a7-b126-89b65b054ef6",
      },
      process: {
        '4f9cd098-fc27-4736-b23f-971c3bff75ff': {
            id:'1c956416-8d09-46f0-8703-59ef95423ea3',
            input:['']
        },
        "9692f4e0-0837-434a-a7df-3eb212c791ea": {
          id: "fe515027-4c9f-4681-8619-ebda738af2b6",
          input: [""],
        },
      },
      userId: {
        // 'bafa931f-838b-4f3b-aac6-247427879c05': {
        //     username: 'Lionel',
        //     id: "b98ff1d2-b557-48d4-a905-fed8bd5888f7"
        // },
        '3cf7ea6f-8245-4f6c-87f2-43ea28b372b8': {
            username: 'Fran',
            id: "e55e4b08-4ed4-4867-9956-2ba2a0a689db"
        },
        // '150d18f7-fcb5-4af8-bcb1-2e83363ac28c': {
        //     username: 'Secretlab_worker',
        //     id: "07bf5f5c-07e5-4750-9f96-ccf3725761f7"
        // },
        // 'a1bdfb48-205a-4c7f-97f1-9701f9e2c5c4': {
        //     username: 'SecretlabAdmin',
        //     id: "d0e31012-592a-42d2-bd33-156b96022021"
        // },
        // 'auth0|5fbe11687861a30076584cee': {
        //     username: 'Ian Kwan',
        //     id: "4b62c90b-5a68-482e-8054-fcc6d51f895a"
        // },
        // 'cdda770a-0c2d-4d8a-9012-4653d4e3d5cb': {
        //     username: 'Secretlab_worker',
        //     id: "07bf5f5c-07e5-4750-9f96-ccf3725761f7"
        // },
        "auth0|5eeb84d52f04240013342065": {
          username: "Curtis McConnell",
          id: "76060974-42ce-414a-a0d6-8158e7cdfb1c",
        },
        // 'auth0|63d2356c3416c557f7d08e96':{
        //     username: "Kun Ming",
        //     id: "32683829-3edc-40c3-8a0a-37513886f957"
        // },
        // 'auth0|5e9d482550f0610cd938cc13':{
        //     username:"Jonathan Seet",
        //     id:"08b46a3b-2809-421d-a212-41be1f54c62e"
        // },
        // "8424e47a-bf4f-4d1b-a56c-5b6cb833897c": {
        //   username: "J.Chun",
        //   id: "574bec5e-496d-43bb-9c7d-e65537db51f2",
        // },
        // '36588a9e-d1e9-4b37-8ee5-f23dd16d11a6':{
        //     username: "S.XiangDong",
        //     id: "c794ed56-418c-4fbb-87d9-4cea7274de52"
        // },
      },
      siteData: {
        "1bfd5bf6-f15e-430e-9652-3bd13fa97a73": {
          siteId: "60711ae8-f5af-4b5d-a6b1-173c3b5c45d9",
          zoneId: "41804d17-99c2-46b7-808e-edbdb1b895b3",
  
          siteName: "AUTHENTIFY STILLWATER MINNESOTA LAB",
          zoneName: "AUTHENTIFY STILLWATER MINNESOTA LAB_DEFAULT",
        },
      },
      deviceId: "",
      deviceName: "Legacy Device",
      product: {
        '3HgBRNPB2eKCe': '8fd96b0b-0a63-41c4-82f3-971ccb354faa',
        K7yMTiTQiJqHZ: '7c7d06e2-3b54-4f75-881f-c15f4c307ea5',
        QLj8WiF2c2mDe: 'e42fbc4b-0c6f-4b78-a556-3480e4d62ff2',
        SWvJWwW2mxJay: 'fc090a57-04f3-4bd3-873d-d1fe9cf5d372',
        gtPvN93bmJwHc: '9c5926e6-8c98-4bf3-abed-7c34a8dfc277',
        hPhXBmd4WB3Fs: '9f0bbb67-9aee-4c76-8f95-49a75da2055f',
        vjDWZ5ZoMmXNK: '74e48978-9c3f-427a-bd16-194382a58e52'
      }
    },
  ];        
//           let tenantArray = [
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

            let enablementData = await mongoDb.collection("authentify").find({ "secretLab.tenantId": { $eq: tenantId[0] } },).toArray();

            // Product Logic
            let enableBulk = []
            let filteredData = []
            let duplicates = []
            let duplicatesArray = []
            for (let enbleData of enablementData) {
                let dataTrim = enbleData.secretLab.metadata.product;
                let check;
                if (enbleData.secretLab?.metadata?.product?.sku != undefined) {
                    console.log("<<<<>>>>", enbleData.secretLab.metadata.product.sku, "   Count ", i)

                }
                if (dataTrim !== undefined && dataTrim !== null) {
                    check = lowercaseKeys(dataTrim)
                }
                enbleData.secretLab.metadata.product = check;
            }
            console.log("Tenant Enablement Data >>>>>", enablementData.length)
            for (let enbleData of enablementData) {
                let product
                let id  
                let url
                let type
                let siteId, siteName, userId, username
                let zoneId, zoneName, newprocessId, productId, inputData=[]
                let upc = enbleData.secretLab.metadata?.product?.barcode
                console.log(upc,"product upc")
                if (upc) {

                    product = upc
                }
                // let sku = enbleData.secretLab.product?.sku
                // if(sku) {
                //     product = sku

                // }
                // else{
                //     product = enbleData.secretLab.metadata?.product?.upc
                // }
                let barcode =[]
                let qrcode =[]
                let uhf = []
                if (enbleData.secretLab.metadata.barcode.length>0) {
                    enbleData.secretLab.metadata.barcode.map((i)=>{
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
                if (enbleData.secretLab.metadata.qrcode.length > 0) {
                    enbleData.secretLab.metadata.qrcode.map((i)=>{
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
                if (enbleData.secretLab.metadata.uhf.length > 0) {
                    enbleData.secretLab.metadata.uhf.map((i)=>{
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
                // if(enbleData.secretLab.project){
                //     inputData.push({
                //         key: "Project",
                //         value: enbleData.secretLab.project.name
                //     })
                // }
                if(enbleData.secretLab.metadata.input.length > 0) {
                    enbleData.secretLab.metadata.input.map((i)=>{
                        inputData.push({
                              key: i.key,
                              value: i.value
                            })  
                    })
                }
                else {
                    inputData = []
                }
                //Primary URL>>>>>>>>>>>..
                // console.log('barcode',barcode)
                if (enbleData.secretLab.nfc.length > 0) {
                    url = enbleData.secretLab.metadata?.nfc[0].url
                    id = enbleData.secretLab.metadata?.nfc[0].id
                    type = "nfc"

                } else if (enbleData.secretLab.uhf.length > 0) {
                    url = enbleData.secretLab.metadata?.uhf[0].url
                    id = enbleData.secretLab.metadata?.uhf[0].id
                    type = "uhf"
                } else if (enbleData.secretLab.barcode.length > 0) {
                    url = enbleData.secretLab.metadata?.barcode[0].url
                    id = enbleData.secretLab.metadata?.barcode[0].id
                    type = "barcode"
                } else {
                    url = enbleData.secretLab.metadata?.qr[0].url
                    id = enbleData.secretLab.metadata?.qr[0].id
                    type = "qr"
                }

                // Site Data 
                Object.keys(tenantData.siteData).map(item => {
                    if(item === enbleData.secretLab.factory.id){
                        siteId = tenantData.siteData[item]?.siteId,
                        zoneId = tenantData.siteData[item]?.zoneId,
                        siteName = tenantData.siteData[item]?.siteName,
                        zoneName = tenantData.siteData[item]?.zoneName   
                    }
                })

                // User Data 
                Object.keys(tenantData.userId).map(user => {
                    if(user === enbleData.secretLab.lastOperator.id){
                        userId = tenantData.userId[user]?.id,
                        username = tenantData.userId[user]?.username
                    }
                        
                })

                // User Process
                Object.keys(tenantData.process).map(processData => {
                    if(processData === enbleData.secretLab.processId){
                        // console.log("processData>>>>",enbleData.secretLab.processId,processData)
                        newprocessId = tenantData.process[processData].id
                    }
                      
                })
                Object.keys(tenantData.product).map(productUpc => {
                    // console.log("Product>>>>",product)
                    if(productUpc === product)
                        productId = tenantData.product[product]
                })


                let x = {
                    key: "Project",
                    value: enbleData.secretLab.project.name
                }
                let Statas = enbleData.secretLab.status
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
                    productExperienceId: enbleData.secretLab.metadata?.product?.experienceid,
                    productExperienceStudioId: enbleData.secretLab.metadata?.product?.experiencestudioid,
                    productExperienceTenantId: enbleData.secretLab.metadata?.product?.experiencetenantid,
                    productUPC: product,
                    status: Statas.toLowerCase(),
                    deviceId: tenantData.deviceId,
                    deviceName: tenantData.deviceName,
                    siteId: siteId,
                    zoneId: zoneId,
                    additionalData:
                    {
                        association: associationData,
                        addInput: [...inputData, x],
                        encode: '',

                    },
                    siteName: siteName,
                    zoneName: zoneName,
                    diId: id,
                    diInfo: enbleData.secretLab?.metadata,
                    primaryURL: url,
                    primaryId: id,
                    primaryIdType: type,
                    productDescription: enbleData?.secretLab?.metadata?.product?.description,
                    count: '',
                    chunkIdentifier: '',
                    finalChunk: '',
                    fileUrl: '',
                    operationTime: enbleData.secretLab?.lastOperationTimestamp,
                    createdAt: enbleData.secretLab?.activationTimestamp,
                    lastUpdatedAt: enbleData.secretLab?.activationTimestamp,

                }
                enableBulk.push(enaleObj)
            }
            // console.log(enableBulk[0].additionalData)
            let uniqueData = [...new Map(enableBulk.map(item => [item['diId'], item])).values()]
            var dp = enableBulk.filter(x => !uniqueData.includes(x))
            console.log(uniqueData.length,"hi unique", dp)
            uniqueData.forEach((item) => {
                // console.log(enableBulk.length,"enable >>>>")
                // find list of duplicates items
                duplicates = enableBulk.filter(x => x?.diId === item?.diId);

                // find item which has least time 

                let result = duplicates.reduce(function (prev, curr) {
                    return prev.createdAt < curr.createdAt ? prev : curr;
                });
                filteredData.push(result);
                // console.log(filteredData.length,"result >>>>>>>>>>>>>.")
                duplicatesArray.push(duplicates)
                // console.log(duplicatesArray.length, duplicates,"sssssssssssssssssssssssss")
            }) 
            // console.log(duplicatesArray.length, duplicates,"sssssssssssssssssssssssss0")
            // console.log(filteredData.length, filteredData[0])
            let unAssignedTag = await mongoDb.collection("Auth_qa_31jan").insertMany(filteredData);
        } catch (err) {
            console.log("Error in tenant Data ", err)
        }
        // to inser in monodb
    }


    console.log("End Of Script>>>>>>>>>>>>>>>>>>>>>>")

})


