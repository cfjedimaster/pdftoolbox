## PDF Toolbox

The PDF Toolbox is meant to be a simple web-based tool to let you test [Adobe PDF Services](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-services.html) and the [Adobe PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html). It is not a pretty tool, but a practical and quick way to see how the APIs handle various different inputs. There are three main features of the tool:

* Convert supported documents to PDF: Simply drag your input into the appropriate box, the API will convert it to the PDF, and it will then be rendered in a PDF Embed.
* Convert PDF to supported formats: Drag a PDF into the box, select a format, and then hit the "Export" button. The API will perform the export, return the result, and your browser will automatically download the result.
* Get properties of the PDF.
* Embed a PDF: As it says, just drag a PDF to view it in the Embed API. You can also change the embed mode. This is *not* as nice as the [Adobe PDF Embed API Demo](https://documentcloud.adobe.com/view-sdk-demo/index.html#/view/FULL_WINDOW/Bodea%20Brochure.pdf), but I've included it here for completeness.


### Setup 

This application is currently online, but not meant for public use as it requires credentials. However, if you wish to run this application yourself, this is what you will need.

First, you need to sign up for a [free trial](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html?ref=getStartedWithServicesSDK) of the Document Services APIs. Doing so will give you credentials to use the API.

Second, you need (possibly) to PDF Embed credentials. This is a [free signup](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html). I say two because your credentials can only be used on one domain. If you want to test at localhost and production, you will need two.

Third, an account with [Pipedream](https://pipedream.com/). Pipedream is a free, serverless and workflow platform. I host the APIs there. Pipedream lets you build powerful workflows, and even better, lets you share them. You will need to view and then copy to your account two workflows:

* ConverToPDF: https://pipedream.com/@raymondcamden/converttopdf-p_MOC8L7b
* ExportPDF: https://pipedream.com/@raymondcamden/exportpdf-p_gYCr5aw
* GetPDFProperties: https://pipedream.com/@raymondcamden/getpdfproperties-p_V9CnJPM

When you fork the above repos, you will need to create environment variables for the following values from your Adobe credentials:

* ADOBE_CLIENT_ID,
* ADOBE_CLIENT_SECRET
* ADOBE_KEY
* ADOBE_ORGANIZATION_ID
* ADOBE_ACCOUNT_ID

Once you've signed up for PDF Services and Embed and then Pipedream, you need to configure keys. There's two parts to this.

First, edit constants.json:

```json
{
	"localhost_key":"9861538238544ff39d37c6841344b78d",
	"prod_host":"mypdftoolbox.netlify.app",
	"prod_key":"b7262c67827b4378a381d33011b8a704",
	"convertToPDFAPI":"https://entb5llsz2h4xuz.m.pipedream.net?pipedream_upload_body=1",
	"exportToPDFAPI":"https://en8qkrlmh26s241.m.pipedream.net?pipedream_upload_body=1",
	"getPDFPropertiesAPI":"https://enpnb5h3yitvfxv.m.pipedream.net?pipedream_upload_body=1"
}
```

Every value needs to be updated with the right values for your own account. When you copy my Pipedream workflows, you will get unique URL end points. Also note if you deploy PDF Toolbox to production, you will need to set `prod_host` correctly.

