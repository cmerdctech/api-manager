'use strict';
const qtoolsGen = require('qtools');
const qtools = new qtoolsGen(module);
const async = require('async');

//START OF moduleFunction() ============================================================

var moduleFunction = function(args) {
	qtools.validateProperties({
		subject: args || {},
		targetScope: this, //will add listed items to targetScope
		propList: [
			{
				name: 'initCallback',
				optional: true
			}
		]
	});

	this.apiStructure = {};
	this.parentPath = '';

	//LOCAL VARIABLES ====================================

	let workerList = {};
	let parentName = '';

	//LOCAL FUNCTIONS ====================================

	const startSystem = () => {
		this.initCallback && this.initCallback();
	};

	//METHODS AND PROPERTIES ====================================

	this.registerApi = function(name, method) {
		const parentPath = this.parentPath ? this.parentPath + '.' : '';
		qtools.putSurePath(this.apiStructure, parentPath + name, method);
	};

	this.getApi = function(pathString) {
		const apiFunction = qtools.getSurePath(this.apiStructure, pathString);
		if (apiFunction) {
			return qtools.getSurePath(this.apiStructure, pathString);
		} else {
			qtools.logError(`apiManager.getApi() says, ${pathString} is not found`);
		}
	};

	this.init = (workerName, newRoot) => {
		const parentPath = this.parentPath ? this.parentPath + '.' : '';
		const descendent = Object.assign({}, this);
		descendent.parentPath = parentPath + workerName;

		if (!newRoot) {
			this.parentPath = descendent.parentPath; //main point is to auto build path so api's can be tracked back to module
		} else {
			this.parentPath = workerName;
		}

		return descendent;
	};

	this.list = label => {
		label = label ? '(at ' + label + ') ' : '';
		const dump = qtools
			.dumpFlat(
				{
					'this.apiStructure': this.apiStructure
				},
				true
			)
			.replace(/this\.apiStructure\./g, '');
		console.log(
			`\n\napiManager method list ${label}=========================\n\n${dump}\nEND apiManager, =========================\n\n`
		);
	};

	//API ENDPOINTS ====================================

	//INITIALIZATION ====================================

	startSystem();

	//SHUTDOWN FUNCTIONS ====================================

	if (
		typeof workerList != 'object' ||
		'this object DOES NOT WANT to SHUT DOWN WORKERS'
	) {
		this.shutdown = (message, callback) => {
			console.log(
				`
shutting down ${__dirname}`
			);
			callback('', message);
		};
	} else {
		const buildShutdownList = message => {
			const shutdownList = [];
			for (var i in workerList) {
				var worker = workerList[i];
				shutdownList.push(
					(i => {
						return done => {
							workerList[i].shutdown(message, done);
						};
					})(i)
				);
			}
			return shutdownList;
		};

		const cleanup = () => {
			let nameString = '';
			for (var i in workerList) {
				workerList[i] = null;
				nameString += `${i}, `;
			}
			qtools.message(
				`[${nameString.replace(/, $/, '')}] were flushed at ${Date.now()}`
			);
			workerList = {};
		};

		this.shutdown = (message, callback) => {
			async.parallel(buildShutdownList(message), () => {
				cleanup();
				callback('', message);
			});
		};
	}

	return this;
};

//END OF moduleFunction() ============================================================

module.exports = moduleFunction;
//module.exports = new moduleFunction();
