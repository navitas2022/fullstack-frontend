import { ChangeDetectionStrategy } from "@angular/compiler/src/compiler_facade_interface";
import { ChangeDetectorRef, OnInit } from "@angular/core";
import { Component } from "@angular/core";

import {
  getContainers,
  createContainer,
  listBlob,
  BLOBItem,
  CONTENT,
  uploadFile,
  deleteBlob,
  deleteContainerV,
  downloadBlob
} from "./azure.storage";

@Component({
  selector: "app-azure-component",
  templateUrl: "./azure.component.html",
})
export class AzureComponent implements OnInit {
  title = "azure demo-ng";
  containers: any = [];
  selectedContainer: string = "";
  listItems: any = [];
  constructor(private changeDetection: ChangeDetectorRef ) {}

 async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
 await this.getContainers();

  }

  async getContainers() {
    getContainers().then((res: Array<string>) => {
      // debugger;
      this.containers = res;
      this.changeDetection.detectChanges();

    });
  }

  upload(file: any) {
    console.log(file.files.length);
    // debugger;
    if (file.files.length > 0) {
      [...file.files].forEach((file: any) => {
        let content: CONTENT = {
          containerName: this.selectedContainer,
          file: file,
          filename: `${this.selectedContainer}-${file.name.substring(0,file.name.lastIndexOf("."))}-${Date.now()}.${
            file.name.split(".")[1]
          }`,
        };
        uploadFile(content).then(async (res: string) => {
          await this.listFiles(this.selectedContainer);

          console.log(res);
        });
        console.log(file);
      });
    }
  }

  create(value: string) {
    createContainer(value).then(async (resp) => {
       await this.getContainers();
      console.log(resp);
    });
  }

  async listFiles(containerName: string) {
    this.selectedContainer = containerName;
    listBlob(containerName).then((res: Array<BLOBItem>) => {
      this.listItems = res;
      console.log(res);
    });
  }

  delete(value: string) {
    deleteBlob(this.selectedContainer, value).then(async (resp: string) => {
      await this.listFiles(this.selectedContainer);
      console.log(resp);
    });
  }

  deleteContainer(value: string) {
    deleteContainerV(value).then(async (resp: string) => {
       await this.getContainers();
      console.log(resp);
    });
  }

  downloadFile(container:string, filename: string){
downloadBlob(container,filename).then((res)=>{

})
  }
}
