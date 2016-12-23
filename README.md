Api Manager helps distribute methods throught a complex application. It helps by providing a publishing mechanism, registerApi(), to help distribute functions and constructing a dotted path reference that can be accessed using a utility method, getApi(). 

This eliminates the need to pass classes and methods through various levels of instantiation. It minimizes the problems of name space pollution through it's registration system. It makes code more reliable by making it easy to locate the definition of a method by automatically keeping track of the location of it's parent object in a system hierarchy. This location is encoded as a dotted path and is the way in which a method is referenced.

A utility method, list(), can be used to list all API paths that have been registered. 

An initialization method is used to allow identification of the name of each node. A parameter is available, 'newRoot', to allow the creation of a new set of paths.

	const apiManagerGen = require('api-manager');
	const apiManagerWorker = new apiManagerGen({
		config: {
			'web-init': {
				port: 8011,
				name: 'Project Name for Logging'
			}
		}
	});
