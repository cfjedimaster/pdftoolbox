/*
dragdrop help: https://stackoverflow.com/a/63066729/52160
*/

const ADOBE_KEY = '9861538238544ff39d37c6841344b78d';

const VALID_TO_PDF = [
	'image/jpeg',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-excel',
	'text/plain',
	'image/bmp',
	'image/gif',
	'image/tiff',
	'image/png'

	];

const app = new Vue({
	el:'#app', 
	data: {
		convertToPDFStatus:'',
		pdfAPIReady: false
	},
	mounted() {
		/*
		for now this is blank - I may set up logic here to know when AdobeDC is ready, but in theory it 
		wont matter as a user has to do a few steps before we even bother showing anything, so no (real) way to 'beat'
		it not being ready.
		*/
	},
	methods: {
		async dropDoc(e) {
			let droppedFiles = e.dataTransfer.files;
      		if(!droppedFiles) return;

			this.convertToPDFStatus = '';

			// only care about file1
			let file = droppedFiles[0];
			if(!this.validForConversion(file.type)) {
				console.log(file.type);
				this.convertToPDFStatus = `Dropped file was not of the correct type.<br/>File type was: ${file.type}`;
				return;
			}

			this.convertToPDFStatus = `Beginning conversion of ${file.name} to PDF...`;
			let fileData = await getFile(file);
			let body = {
				type:file.type,
				name:file.name,
				data:fileData
			};

			let resp = await fetch('https://entb5llsz2h4xuz.m.pipedream.net?pipedream_upload_body=1', {
				method:'POST', 
				body: JSON.stringify(body)
			});
			let data = await resp.json();
			this.convertToPDFStatus = 'File converted. Previewing below.';

			// render to the PDF Embed
			this.pdfRender(data.result);


		},
		pdfRender(data) {
			console.log('going to try to render');
			let pdfView = new AdobeDC.View({
				clientId: ADOBE_KEY, divId: "pdfEmbed" 
			});

			pdfView.previewFile({
				content:{ promise: Promise.resolve(base64ToArrayBuffer(data)) },
				metaData:{fileName: "result.pdf"}
			});	

		},
		validForConversion(type) {
			return VALID_TO_PDF.includes(type);
		}
	}
});

//Modified from: https://tpiros.dev/blog/image-upload-and-metadata-extraction-with-netlify-functions/
async function getFile(f) {

	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = e => {
			resolve(reader.result);
		}
		reader.onerror = reject;
		reader.readAsDataURL(f);
	});
}

function base64ToArrayBuffer(base64) {
	var bin = window.atob(base64);
	var len = bin.length;
	var uInt8Array = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		uInt8Array[i] = bin.charCodeAt(i);
	}
	return uInt8Array.buffer;
}

document.addEventListener("adobe_dc_view_sdk.ready", () => { app.pdfAPIReady = true; });
