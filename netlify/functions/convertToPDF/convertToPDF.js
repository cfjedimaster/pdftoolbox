const { Readable } = require('stream');
const pdfSDK = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const nanoid = require('nanoid').nanoid;

let creds = {
	clientId:process.env.ADOBE_CLIENT_ID,
	clientSecret:process.env.ADOBE_CLIENT_SECRET,
	privateKey:process.env.ADOBE_KEY,
	organizationId:process.env.ADOBE_ORGANIZATION_ID,
	accountId:process.env.ADOBE_ACCOUNT_ID
}

const handler = async (event) => {
  try {

    console.log('running convertToPDF');

    let body = event.body;
    let mimeType = body.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
    body = body.replace(/data:.*?;base64/,'');
    let binaryData = Buffer.from(body, 'base64');


    let input = `./${nanoid()}`;
    fs.writeFileSync('./testRay.docx', binaryData);

    let ref = pdfSDK.FileRef.createFromLocalFile(input);
    console.log('got this far');

    let pdf = await createPDF(ref,creds);

    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

async function createPDF(source, creds) {

    return new Promise((resolve, reject) => {

    const credentials = pdfSDK.Credentials.serviceAccountCredentialsBuilder()
		.withClientId(creds.clientId)
		.withClientSecret(creds.clientSecret)
		.withPrivateKey(creds.privateKey)
		.withOrganizationId(creds.organizationId)
		.withAccountId(creds.accountId)
		.build();

		const executionContext = pdfSDK.ExecutionContext.create(credentials),
				createPdfOperation = pdfSDK.CreatePDF.Operation.createNew();

		// Set operation input from a source file
		//const input = pdfSDK.FileRef.createFromLocalFile(source);
		createPdfOperation.setInput(source);

		// Execute the operation and Save the result to the specified location.
		createPdfOperation.execute(executionContext)
		.then(result => resolve(result))
		.catch(err => {
			if(err instanceof pdfSDK.Error.ServiceApiError
			|| err instanceof pdfSDK.Error.ServiceUsageError) {
				reject(err);
			} else {
				reject(err);
			}
		});

	});
}

module.exports = { handler }