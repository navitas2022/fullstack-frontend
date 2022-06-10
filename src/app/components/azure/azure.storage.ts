
import {
  BlobServiceClient,
} from "@azure/storage-blob";
import { BlobItem } from '@azure/storage-blob';
import { environment } from "../../../../src/environments/environment";
const account = environment.ACCOUNT_NAME;
const accountKey = environment.SAS;
// BlobClientServiceString
//const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${accountKey}`);

const blobServiceClient = new BlobServiceClient(`${accountKey}`);

export enum AllContainers {
  coverpage = "coverpage2",
  budget = "budget1",
  contents = "contents1",
  abstract = "abstract1",
  performance = "performance1",
  purpose = "purpose1",
  allfiles = "allfiles1",
  zip = "zip1"
}

export interface BLOBItem extends BlobItem { };
export interface CONTENT {
  containerName: string; // desired container name
  file: any;  // file to upload
  filename: string; // filename as desired with path
}
let maxNumber = 10000;


export function setToken(token: any, container: string, currentToken: any) { // Public Domain/MIT
  if (currentToken){
    maxNumber = parseInt(currentToken);
    return;
  }
  const d = parseInt(token);
  if (!isNaN(d)){
    if (d >= maxNumber){
      maxNumber = (container === AllContainers.allfiles ? d+1: d);
    }
  }
}
export function generateUUID() { // Public Domain/MIT
    return maxNumber.toString();
}

function UUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}


export async function getContainers() {
  // debugger;
  let containers = [];
  let iter = blobServiceClient.listContainers();
  let containerItem = await iter.next();
  while (!containerItem.done) {
    containers.push(containerItem.value.name);
    containerItem = await iter.next();
  }
  return containers;
}


export interface MyFileData {
  file: File,
  size:string,
  date: string,
  desc: string,
  token: string,
  container: string,
  originalContainer: string,
  fileName: string,
  status: string,

}

export function changeName(filename: string, token: string){
  return filename.split('.')[0]+token+'.'+filename.split('.')[filename.split('.').length-1]

}

export function newFileUpload(file: File, container: string, desc = "Description", token= '', status= 'Not started'): MyFileData{
  token = token || generateUUID();
  let name = changeName(file.name, UUID());
  name = name.replace(/ /g, '').replace(/[^\x00-\x7F]/g, "");;
  return {
    file,
    size: (file.size / 1024).toFixed(0) + "kb",
    date: String(new Date()).substring(0, 24),
    desc,
    token,
    container,
    originalContainer: container,
    fileName: name,
    status
  }
}

export async function createContainer(containername: any) {
  const ac = account;
  const containerName = containername || `${new Date().getTime()}`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  try {
    const createContainerResponse = await containerClient.create();
    return `Create container ${containerName} successfully ${createContainerResponse.requestId}`;
  }
  catch (err) {
    return { requestId: err.details.requestId, statusCode: err.statusCode, errorCode: err.details.errorCode }
  }
}


export async function listBlob(containerName: string) {
  // BlobContainerClient
  const containerClient = blobServiceClient.getContainerClient(containerName);
  let ListBlobs = [];
  let iter = containerClient.listBlobsFlat({includeMetadata: true});
  let blobItem = await iter.next();
  while (!blobItem.done) {
    ListBlobs.push(blobItem.value);
    blobItem = await iter.next();
  }
  return ListBlobs;
}

export async function deleteBlob(containerName: string, filename: string) {
  console.log('deleteBlob',containerName, filename )

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  const deleteBlob = await blockBlobClient.delete();
  return `Deleted Blob ${filename} successfully ${deleteBlob.requestId}`;
}

export async function deleteContainerV(containerName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const deleteContainer = await containerClient.delete();
  return `Deleted Blob ${containerName} successfully ${deleteContainer.requestId}`;
}

export async function uploadFile(content: CONTENT, metadata ?: {
  [propertyName: string]: string;
}) {
  const containerClient = blobServiceClient.getContainerClient(content.containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(content.filename);
  const uploadBlobResponse = await blockBlobClient.uploadBrowserData(content.file, {
    maxSingleShotSize: 4 * 1024 * 1024,
    blobHTTPHeaders: { blobContentType: content.file.type },
    metadata
  });
  return `Upload block blob ${content.filename} successfully ${uploadBlobResponse.requestId}`;
}

export async function uploadFile2(content: MyFileData, newContainer?: string, file? :Blob, isFinished=false) {

  const containerClient = blobServiceClient.getContainerClient(newContainer || content.container);

  const blockBlobClient = containerClient.getBlockBlobClient(content.fileName);
  const uploadBlobResponse = await blockBlobClient.uploadData(file || content.file, {
    maxSingleShotSize: 4 * 1024 * 1024,
    blobHTTPHeaders: { blobContentType: content.file.type },
    metadata: {
      size: content.size,
      token: content.token,
      date: content.date,
      container: newContainer || content.container,
      desc: content.desc,
      fileName: content.fileName,
      status: isFinished? "Finished" :content.status,
      originalContainer: content.originalContainer
    }
  });
  await blockBlobClient.setHTTPHeaders({blobContentDisposition: `inline;filename="${content.fileName}"`})

  console.log('token', content)

  return `Upload block blob ${content.token} successfully ${uploadBlobResponse.requestId}`;
}

export async function downloadBlob(containerName: string, filename: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(filename);
  // Get blob content from position 0 to the end
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  // blobClient
  // const downloadBlockBlobResponse = await blobClient.download();
  // const downloaded = await downloadBlockBlobResponse.blobBody;
  // let tmp = <Blob>downloaded
  // var url = window.URL.createObjectURL(tmp);
  return blobClient.url;

  // [Browsers only] A helper method used to convert a browser Blob into string.
}


export async function getBlob(containerName: string, filename: string) {
  console.log('getBlob',containerName, filename )
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(filename);
  // Get blob content from position 0 to the end
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = await downloadBlockBlobResponse.blobBody;
  return downloaded;

  // [Browsers only] A helper method used to convert a browser Blob into string.
}

export async function updateMetadata(containerName: string, filename: string, metadata: any) {
  console.log('getBlob',containerName, filename )
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(filename);
  await blobClient.setMetadata(metadata)

  // [Browsers only] A helper method used to convert a browser Blob into string.
}

