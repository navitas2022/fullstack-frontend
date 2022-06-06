import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { deleteBlob, listBlob } from "../azure/azure.storage"
import BMF from "browser-md5-file"

@Component({
  selector: 'app-panel1',
  templateUrl: './panel1.component.html',
  styleUrls: ['./panel1.component.scss']
})
export class Panel1Component implements OnInit {
  @ViewChild("panel") panel: MatExpansionPanel
  @Input() dataTable = []
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
      if (!this.dataTable.length) {
        this.dataTable.push([file, (file.size / 1024).toFixed(0) + "kb", String(new Date()).substring(0, 24), "Description", "coverpage"])
      }

      else {
        let conf = confirm("Only one file allowed. Do you want to replace the file?")
        if (conf) {
          await deleteBlob("coverpage", this.dataTable[0][0].name)
          this.dataTable[0] = [file, (file.size / 1024).toFixed(0) + "kb", String(new Date()).substring(0, 24), "Description", "coverpage"]
        }
      }
    }
  }
}

