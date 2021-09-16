'use strict';

// Usage listInVPC.js [filter_function_name]


const shell = require('shelljs');

const args = process.argv;

let filter = '';
if (args[2] != undefined)
	filter = args[2];

// Listing function and applying filter if specified
let data = shell.exec('aws lambda list-functions | grep FunctionName', { silent: true });
let ar = data.stdout.split('\n');
let funcList = [];
for (let i = 0; i < (ar.length - 1); i++) {
	let t = ar[i].split(':');
	let func = t[1].replace('"', '').replace('"', '').replace(',', '').trim();

	if (filter.length > 0) {
		if (func.indexOf(filter) != -1)
			funcList.push(func);
	}
	else
		funcList.push(func);
}


// For each function checking if VPC is present
for (let i = 0; i < funcList.length; i++) {
	let cmd = `aws lambda get-function --function-name ${funcList[i]} --query 'Configuration.VpcConfig.VpcId'`
	let vpcData = JSON.parse(shell.exec(cmd, { silent: true }))
	if (vpcData != null && vpcData.length > 0) {
		console.log(`VPC FOUND in ${funcList[i]} ==> ${vpcData}`)
	}
	else
		console.log(`${funcList[i]} is not in a VPC`)
}
