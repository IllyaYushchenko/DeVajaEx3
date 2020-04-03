
function listImages() {

	let storage = firebase.storage();
	let storageRef = storage.ref();
	//let i = 0;
	storageRef.child('images/').listAll().then(function (result) {
		result.items.forEach(function (imageRef) {
	//		i++;
			displayImage(imageRef);
		});

	});
}

function displayImage( images) {
	images.getDownloadURL().then(function (url) {
		console.log(url);
	});
}