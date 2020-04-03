

function openForm() {
	document.getElementById("popup").style.display = "block";

}
function closeForm() {
	document.getElementById("popup").style.display = "none";

}

function upload() {

	var canvas = document.getElementById('lightpanel');

	canvas.toBlob(function (blob) {

		//image = blob;
		const imageName = `${document.getElementById('name').value} + ${new Date()}`
		//firebase  storage reference
		//it is the path where yyour image will store
		const storageRef = firebase.storage().ref('images/' + imageName);
		//upload image to selected storage reference

		const uploadTask = storageRef.put(blob);

		uploadTask.on('state_changed', function (snapshot) {
			//observe state change events such as progress , pause ,resume
			//get task progress by including the number of bytes uploaded and total
			//number of bytes
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log("upload is " + progress + " done");
		}, function (error) {
			//handle error here
			console.log(error.message);
		}, function () {
			//handle successful uploads on complete

			uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
				//get your upload image url here...
				console.log(downlaodURL);
				img = document.createElement('img');
				img.src = downlaodURL;

				let div = document.createElement('div');
				div.innerHTML = `<img src="${downlaodURL}"/>`;
				div.setAttribute('class', 'grid-item');
				document.querySelector('.three-col-grid').appendChild(div);

			});
		});
	});
	document.getElementById("popup").style.display = "none";
}

function listImages() {

	let storage = firebase.storage();
	let storageRef = storage.ref();
	
	
	storageRef.child('images/').listAll().then(function (result) {
		result.items.forEach(function (image) {
		image.getDownloadURL().then(function (url) {
			let div = document.createElement('div');
			div.innerHTML = `<img src="${url}"/>`;
			div.setAttribute('class', 'grid-item');
			document.querySelector('.three-col-grid').appendChild(div);
	});
		});
		
	});

}

function displayImage( images) {
	images.getDownloadURL().then(function (url) {
		console.log(url);
	});
}

$(document).ready(function () {
	const imageOn = document.getElementById('ledOn');
	const imageOff = document.getElementById('ledOff');
	// Two dimensional array that represents the playing field
	// A "x" stands for "on"
	// A "o" stands for "off"
	const lightField =
		[
			["o", "o", "o", "o", "o", "o", "o", "o"],
			["o", "o", "o", "o", "o", "o", "o", "o"],
			["o", "o", "x", "o", "o", "x", "o", "o"],
			["o", "o", "o", "o", "o", "o", "o", "o"],
			["o", "o", "x", "o", "o", "x", "o", "o"],
			["o", "o", "o", "x", "x", "o", "o", "o"],
			["o", "o", "o", "o", "o", "o", "o", "o"],
			["o", "o", "o", "o", "o", "o", "o", "o"],
		];

	// Paint the panel
	repaintPanel();

	// User can click until the game is finished

	// Attach a mouse click event listener
	$("#lightpanel").click(function (e) {



		// e will give us absolute x, y so we need to calculate relative to canvas position
		let pos = $("#lightpanel").position();
		let ox = e.pageX - pos.left;
		let oy = e.pageY - pos.top;

		// Check which fields we need to flip
		let yField = Math.floor(oy / 25);
		let xField = Math.floor(ox / 25);

		// The field itself
		lightField[yField][xField] = lightField[yField][xField] == "x" ? "o" : "x";


		repaintPanel();
	});

	/*
	* Repaints the panel
	*/
	function repaintPanel() {

		// Retrieve the canvas
		const canvas = document.getElementById("lightpanel");

		// Check if the browser supports <canvas>
		if (!canvas.getContext) {
			alert("This demo requires a browser that supports the <canvas> element.");
			return;
		} else {
			clear();

			// Get the context to draw on
			let ctx = canvas.getContext("2d");

			// Create the fields

			for (let i = 0; i < lightField.length; i++) { // Rows
				for (let j = 0; j < lightField[i].length; j++) { // Columns

					if (lightField[i][j] == "x") {
						//ctx.arc(j * 100 + 50, i * 100 + 50, 38, 0, Math.PI*2, true);
						ctx.drawImage(imageOn, j * 25, i * 25, 25, 25);

						// Since we need to fill this field, not all the lights are off

					}
					else {
						ctx.drawImage(imageOff, j * 25, i * 25, 25, 25);

					}

				}
			}


		}
	}

	/*
	* Clears the canvas
	*/

	function clear() {
		const canvas = document.getElementById("lightpanel");
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.heigth);
	}
	listImages();

});

