import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { deleteBlob, listBlob, newFileUpload, uploadFile2 } from "../azure/azure.storage"
import BMF from "browser-md5-file"
import { AllContainers } from '../azure/azure.component';

@Component({
  selector: 'app-panel1',
  templateUrl: './panel1.component.html',
  styleUrls: ['./panel1.component.scss']
})
export class Panel1Component implements OnInit {
  @ViewChild("panel") panel: MatExpansionPanel
  @Input() dataTable = []
  @Input() name :string;
  @Input() container :string;
  @Input() isMulti = false;
  @Input() isRequired = false;
  @Output() uploadFile = new EventEmitter<File>();
  bmf = new BMF()
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
    let input = document.createElement("input")
    input.type = 'file'
    input.click()
    input.onchange = async (e: any) => {
      let file = e.target.files[0]
      const newFile = newFileUpload(file,this.container);
      console.log('newFile', newFile);
      if (!this.dataTable.length || this.isMulti) {
        await uploadFile2(newFile)

        this.dataTable.push(newFile)
      }

      else {
        let conf = confirm("Only one file allowed. Do you want to replace the file?")
        if (conf) {
          await deleteBlob(this.container, this.dataTable[0].fileName)
          await uploadFile2(newFile)

          this.dataTable = [];
          this.dataTable.push(newFile)
        }
      }
    }
  }
}

