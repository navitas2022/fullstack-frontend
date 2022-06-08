import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-bottom-table',
  templateUrl: './bottomTable.component.html',
  styleUrls: ['./bottomTable.component.scss']
})
export class BottomTableComponent implements OnInit {
  @ViewChild("panel") panel: MatExpansionPanel
  @Input() dataTable = []
  @Input() container :string
  @Input() isHome = false

  
  constructor() { }

  ngOnInit(): void {
  }
  attachFile(ev: any) {
    ev.preventDefault();
    ev.stopPropagation();
    let input = document.createElement("input")
    input.type = 'file'
    input.click()
    input.onchange = (e: any) => {
      let file = e.target.files[0]
      let already = false
      this.dataTable.forEach(element => {
        if (element[0].name == file.name) already = true
      });

      if (already) return alert("File already exists")
      this.dataTable.push([file, (file.size / 1024).toFixed(0) + "kb", String(new Date()).substring(0, 24), "Description", "purpose"])
    }
  }
}
