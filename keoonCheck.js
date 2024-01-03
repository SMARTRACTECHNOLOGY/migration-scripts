const net = require('net');
const file_e = require('fs');
const port = 7070;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});
 
let sockets = [];

    server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        
        console.log('Remote Address ' + sock.remoteAddress +'\n \r');
        //console.log('Received Data ' + data +'\n \r');
        //console.log(" Type of Data : ", typeof(data));
        try{
        const responseData=String(data).split('deflate');
        const tyl=responseData[1].trim();
        //console.log("Converted Data : ",tyl); 
        const convertedData = JSON.parse(tyl);   
        //console.log("Parse Data :", convertedData);
        console.log("Device ID :", convertedData.devid);
        console.log("Device ID :", convertedData.devip);
        console.log("Device ID :", convertedData.devmac);
        //console.log(convertedData.reads);
        let tag_array=convertedData.reads;
            tag_array.forEach(element => {
                console.log("Tag Read Start ------------> ");
                console.log("Tag Element EPC : -> ", element.epc);
                console.log("Tag Element SKU : -> ", element.sku);
                console.log("Tag Element Serial Number : -> ", element.serial);
                console.log("Tag Element TID : -> ", element.tid);
                console.log("Tag Element URI : -> ", element.uri);
                console.log("Tag Element RSSI : -> ", element.rssi);
                console.log("Tag Element TS : -> ", element.ts);
                console.log("Tag End ------------");
            });
        }
        catch (error)   
            {
                   console.log("Unformated Data .",error); 
            }
        });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED : ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});