'use strict';


var fs = require('fs');
var cheerio = require('cheerio');
var readline = require('linebyline');
var request = require('request');


var dirDone = './storage/done';
var dirTask = './storage/task';


var download = function(urlPath){
	return new Promise(function(resolve, reject){
		request(urlPath, function(error, response, body){
			if(error){
				reject(error);
			}
			else{
				resolve({
					body: body,
					response: response,
					statusCode: response.statusCode
				});
			}
		})
	});
};
var download2file = function(urlPath, filePath){
	request(urlPath).pipe(fs.createWriteStream(filePath));
};


var task = function(tasksFilePath, dirDone){
	let RE = /^(?:(https?)[\:][\/]{2})?([^\/]+)([\/][^\?\#]*)?(?:[\?]([^\#]*))?(?:[\#].*)?$/i;
	readline('' + tasksFilePath)
		.on('line', function(line, lineCount, byteCount){
			console.log('url: ' + line);
			// do something with the line of text
			if(RE.test(line)){
				let urlPath = line;
				let fileName = line.replace(RE, '$4').replace(/^.*?([\d]{5})$/, '$1');
				let filePath = dirDone + '/' + fileName + '.html';
				download2file(urlPath, filePath);
			}
		})
		.on('error', function(error){
			// something went wrong
		});
};
var tasks = function(dirPath, dirDone){
	fs.readdir(dirPath, function(error, items) {
		if(error) throw error;
		else{
			console.log('file: ' + items);
			items.forEach(function(item, index){
				task(dirPath + '/' + item, dirDone);
			});
		}
	});
};


tasks(dirTask, dirDone);

