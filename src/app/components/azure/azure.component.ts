import { AfterViewInit, ChangeDetectionStrategy } from "@angular/core";
import { ChangeDetectorRef, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import {
  getContainers,
  createContainer,
  listBlob,
  BLOBItem,
  CONTENT,
  uploadFile,
  deleteBlob,
  deleteContainerV,
  downloadBlob,
  generateUUID,
  uploadFile2,
  MyFileData,
  getBlob,
  setMaxNumber
} from "./azure.storage";

export enum AllContainers {
  coverpage = "coverpage2",
  budget = "budget1",
  contents = "contents1",
  abstract = "abstract1",
  performance = "performance1",
  purpose = "purpose1",
  allfiles = "allfiles1"
}

@Component({
  selector: "app-azure-component",
  templateUrl: "./azure.component.html",
})
export class AzureComponent implements OnInit, AfterViewInit {
  title = "azure demo-ng";
  containers: any = [];
  selectedContainer: string = "";
  listItems: any = [];
  containersList = AllContainers;
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
  allfiles = []
  constructor(public authService: AuthService,private changeDetection: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }

  ngAfterViewInit() {
    if (this.route.snapshot.queryParams['scroll'])
      setTimeout(() => {
        document.querySelector('.allFiles')?.scrollIntoView({ behavior: 'smooth' });
        this.router.navigate([], {
          queryParams: {
            'scroll': null,
          },
          queryParamsHandling: 'merge'
        })
      }, 1000)
  }

  nameByContainer = {
    [AllContainers.coverpage]: 'cover',
    [AllContainers.budget]: 'budget',
    [AllContainers.contents]: 'contents',
    [AllContainers.abstract]: 'abstract',
    [AllContainers.performance]: 'performance',
    [AllContainers.purpose]: 'purpose',
    [AllContainers.allfiles]: 'allfiles',
  }


  loadData() {
    this.fillCont(AllContainers.coverpage)
    this.fillCont(AllContainers.budget)
    this.fillCont(AllContainers.contents)
    this.fillCont(AllContainers.abstract)
    this.fillCont(AllContainers.performance)
    this.fillCont(AllContainers.purpose)
    this.fillCont(AllContainers.allfiles)
  }



  async fillCont(name: string) {
    // await this.create(name);
    let files = await listBlob(name)
    this[this.nameByContainer[name]] = [];
    console.log(name, files)
    files.map(el => {
      setMaxNumber(el.metadata.token);
      this[this.nameByContainer[name]].push(
        {
          file: el,
          ...el.metadata
        }
      )
      // else this[name].push(
      //   el
      // )
    })

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

    if (this.cover.length) await this.moveToContainer(this.cover[0], AllContainers.allfiles)
    if (this.budget.length) await this.moveToContainer(this.budget[0], AllContainers.allfiles)
    if (this.abstract.length) await this.moveToContainer(this.abstract[0], AllContainers.allfiles)
    if (this.performance.length) await this.moveToContainer(this.performance[0], AllContainers.allfiles)
    if (this.contents.length) await this.moveToContainer(this.contents[0], AllContainers.allfiles)

    if (this.purpose.length) {
      for (let v of this.purpose) {
        await this.moveToContainer(v, AllContainers.allfiles)
      }
    }
    this.loadData();
    alert("Everything uploaded successfully!")
  }


  async moveToContainer(fileData: MyFileData, newContainer: string) {
    console.log('fileData', fileData, newContainer);
    await uploadFile2(fileData, newContainer, await getBlob(fileData.container, fileData.fileName))
    await deleteBlob(fileData.container, fileData.fileName)


  }


  async uploadFiles(cont: string, obj: any) {
    console.log('uploadFiles', cont, obj);

    return await uploadFile({
      containerName: cont,
      file: obj,
      filename: obj[0].name
    })
  }
}
