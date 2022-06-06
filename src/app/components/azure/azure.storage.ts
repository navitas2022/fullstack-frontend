
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

export interface BLOBItem extends BlobItem { };
export interface CONTENT {
  containerName: string; // desired container name
  file: any;  // file to upload
  filename: string; // filename as desired with path
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
  let iter = containerClient.listBlobsFlat();
  let blobItem = await iter.next();
  while (!blobItem.done) {
    ListBlobs.push(blobItem.value);
    blobItem = await iter.next();
  }
  return ListBlobs;
}

export async function deleteBlob(containerName: string, filename: string) {
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

export async function uploadFile(content: CONTENT) {
  const containerClient = blobServiceClient.getContainerClient(content.containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(content.filename);
  const uploadBlobResponse = await blockBlobClient.uploadBrowserData(content.file, {
    maxSingleShotSize: 4 * 1024 * 1024,
    blobHTTPHeaders: { blobContentType: content.file.type } // set mimetype
  });
  return `Upload block blob ${content.filename} successfully ${uploadBlobResponse.requestId}`;
}

export async function downloadBlob(containerName: string, filename: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(filename);

  // Get blob content from position 0 to the end
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = await downloadBlockBlobResponse.blobBody;
  let tmp = <Blob>downloaded
  var url = window.URL.createObjectURL(tmp);
  window.open(url)
  return url;

  // [Browsers only] A helper method used to convert a browser Blob into string.
}
