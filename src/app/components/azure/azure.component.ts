import { ChangeDetectionStrategy } from "@angular/core";
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
  sampleData = [
    ["Document Tile", "115kb", "12/12/2012", "Lorem ipsum asjkd afnw oisdfuiosfuweif wioefrhwuief wioenfwuoef iosehfowief oiwejoeirg ioenfowienf iowen rgiosdof"],
  ]
  files = []
  cover = []
  budget = []
  contents = []
  abstract = []
  performance = []
  purpose = []
  constructor(private changeDetection: ChangeDetectorRef) { }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.getContainers();
    this.fillCont("coverpage")
    this.fillCont("budget")
    this.fillCont("contents")
    this.fillCont("abstract")
    this.fillCont("performance")
    this.fillCont("purpose")
  }

  async fillCont(name: string) {
    let files = await listBlob(name)
    console.log(files)
    files.map(el => {
      if (name == "coverpage") this.cover.push(
        [el, (el.properties.contentLength / 1024).toFixed(0) + "kb", String(el.properties.lastModified).substring(0, 24), el.properties.contentType, name]
      )
      else this[name].push(
        [el, (el.properties.contentLength / 1024).toFixed(0) + "kb", String(el.properties.lastModified).substring(0, 24), el.properties.contentType, name]
      )
    })

  }

  async getContainers() {
    getContainers().then((res: Array<string>) => {
      // debugger;
      this.containers = res;
      this.changeDetection.detectChanges();
      this.files = res.map(el => ([el, "115kb", "12/12/2018", "Document purpose unknown"]))

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
          filename: `${this.selectedContainer}-${file.name.substring(0, file.name.lastIndexOf("."))}-${Date.now()}.${file.name.split(".")[1]
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
    this.listItems = await listBlob(containerName)
    return this.listItems;
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

  downloadFile(container: string, filename: string) {
    downloadBlob(container, filename).then((res) => {
    })
  }

  async save() {
    if (!this.cover.length) return alert("Please upload cover page")
    if (!this.budget.length) return alert("Please upload budget narrative file")
    if (!this.contents.length) return alert("Please upload Key contents file")
    //cover upload
    if (!("properties" in this.cover[0][0])) await this.uploadFiles("coverpage", this.cover[0][0])
    //budget upload
    if (!("properties" in this.budget[0][0])) await this.uploadFiles("budget", this.budget[0][0])
    //abstract upload
    if (this.abstract.length && !("properties" in this.abstract[0][0])) await this.uploadFiles("abstract", this.abstract[0][0])
    //performance upload
    if (this.performance.length && !("properties" in this.performance[0][0])) await this.uploadFiles("performance", this.performance[0][0])
    //purpose upload
    if (this.purpose.length) {
      for (let v of this.purpose) {
        if (!("properties" in v[0])) await this.uploadFiles("purpose", v[0])
      }
    }
    //contents upload
    if (!("properties" in this.contents[0][0])) await this.uploadFiles("contents", this.contents[0][0])
    alert("Everything uploaded successfully!")
  }
  async uploadFiles(cont: string, obj: any) {
    return await uploadFile({
      containerName: cont,
      file: obj,
      filename: obj.name
    })
  }
}
