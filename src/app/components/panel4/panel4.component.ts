import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from "@angular/material/expansion"
import { deleteBlob } from '../azure/azure.storage';
@Component({
  selector: 'app-panel4',
  templateUrl: './panel4.component.html',
  styleUrls: ['./panel4.component.scss']
})
export class Panel4Component implements OnInit {
  @ViewChild("panel") panel: MatExpansionPanel
  @Input() dataTable = []
  constructor() { }

  ngOnInit(): void {
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
        this.dataTable.push([file, (file.size / 1024).toFixed(0) + "kb", String(new Date()).substring(0, 24), "Description", "abstract"])
      }
      else {
        let conf = confirm("Only one file allowed. Do you want to replace the file?")
        if (conf) {
          await deleteBlob("coverpage", this.dataTable[0][0].name)
          this.dataTable[0] = [file, (file.size / 1024).toFixed(0) + "kb", String(new Date()).substring(0, 24), "Description", "abstract"]
        }
      }
    }
  }
}
