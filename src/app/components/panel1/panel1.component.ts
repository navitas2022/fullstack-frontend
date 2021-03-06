import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AllContainers, deleteBlob, listBlob, MyFileData, newFileUpload, uploadFile2 } from "../azure/azure.storage"
import BMF from "browser-md5-file"

@Component({
  selector: 'app-panel1',
  templateUrl: './panel1.component.html',
  styleUrls: ['./panel1.component.scss']
})
export class Panel1Component implements OnInit {
  @ViewChild("panel") panel: MatExpansionPanel
  @Input() dataTable = []
  @Input() name: string;
  @Input() container: string;
  @Input() isMulti = false;
  @Input() isRequired = false;
  @Input() isEdit = false;
  @Output() uploadFile = new EventEmitter<File>();
  @Output() update = new EventEmitter();
  bmf = new BMF()
  containersList = AllContainers;

  constructor() {

  }

  ngOnInit(): void {
    // listBlob("cover_page").then(res=>{
    //   console.log(res)
    // })
  }

  attachFile(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    const types = ['application/x-zip', 'application/zip', 'application/x-zip-compressed','application/octet-stream'];
    let input = document.createElement("input")
    input.type = 'file'
    if (this.container === AllContainers.zip) {
      input.accept = ".zip"
    }
    input.click()
    input.onchange = async (e: any) => {
      let file = e.target.files[0];
      if (!types.includes(file.type) && this.container === AllContainers.zip) {
        return alert("Incorrect file type for Zip Files")
      }
      const newFile = newFileUpload(file, this.isEdit ? AllContainers.allfiles : this.container);
      newFile.originalContainer = this.container;
      console.log('newFile', newFile);

      if ((!this.dataTable.length) || this.isMulti) {
        await uploadFile2(newFile)

        this.update.emit();
      }

      else {
        let conf = confirm("Only one file allowed. Do you want to replace the file?")
        if (conf) {
          await deleteBlob(this.dataTable[0].container, this.dataTable[0].fileName)
          await uploadFile2(newFile)
          this.update.emit();
        }
      }
    }
  }

  get tableName() {
    var str = this.name;
    return str.split(' ').join('_');
  }
}

