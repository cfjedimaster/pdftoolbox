/*
dragdrop help: https://stackoverflow.com/a/63066729/52160
todo - validate good file types
*/

const VALID_TO_PDF = ['image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const app = new Vue({
	el:'#app', 
	data: {
		convertToPDFStatus:''
	},
	methods: {
		async dropDoc(e) {
			let droppedFiles = e.dataTransfer.files;
      		if(!droppedFiles) return;

			// only care about file1
			let file = droppedFiles[0];
			if(!this.validForConversion(file.type)) {
				console.log(file.type);
				alert(`Dropped file was not of the correct type.\nFile type was: ${file.type}`);
			}

			this.convertToPDFStatus = `Beginning conversion of ${file.name} to PDF...`;
			let fileData = await getFile(file);	
			let resp = await fetch('/api/convertToPDF', {
				method:'POST', 
				body: fileData
			});
			let data = await resp.json();


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
