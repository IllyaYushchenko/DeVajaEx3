function openForm() {
	document.getElementById('name').value="";
	document.getElementById("popup").style.display = "block";

}
function closeForm() {
	document.getElementById("popup").style.display = "none";
	document.getElementById('name').style.background = "white";

}

function upload() {
	if (document.getElementById('name').value) {
		let canvas = document.getElementById('lightpanel');

		canvas.toBlob(function (blob) {

			//image = blob;
			const imageName = `${document.getElementById('name').value} + ${new Date()}`
			
			//firebase  storage reference
			//it is the path where image will be stored
			
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
		document.getElementById('name').style.background = "white";
		
	} else {
		document.getElementById('name').style.background = "red";
	}
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


document.addEventListener('DOMContentLoaded', function () {
	const imageOn = document.getElementById('ledOn');
	const imageOff = document.getElementById('ledOff');
	// Two dimensional array that represents the light panel
	
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

	
	document.getElementById("lightpanel").addEventListener("click", function (e) {
		let panel = document.getElementById("lightpanel");

		let ox = e.pageX - panel.offsetLeft;
		let oy = e.pageY - panel.offsetTop;

		// Check which fields we need to switch
		let yField = Math.floor(oy / 25);
		let xField = Math.floor(ox / 25);

		
		lightField[yField][xField] = lightField[yField][xField] == "x" ? "o" : "x";


		repaintPanel();
	});

	
	function repaintPanel() {

		const canvas = document.getElementById("lightpanel");

		if (!canvas.getContext) {
			alert("This demo requires a browser that supports the <canvas> element.");
			return;
		} else {
			clear();

			let ctx = canvas.getContext("2d");

			for (let i = 0; i < lightField.length; i++) { // Rows
				for (let j = 0; j < lightField[i].length; j++) { // Columns

					if (lightField[i][j] == "x") {
						ctx.drawImage(imageOn, j * 25, i * 25, 25, 25);
					}
					else {
						ctx.drawImage(imageOff, j * 25, i * 25, 25, 25);
					}
				}
			}
		}
	}

function clear() {
		const canvas = document.getElementById("lightpanel");
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.heigth);
	}
	listImages();

});

