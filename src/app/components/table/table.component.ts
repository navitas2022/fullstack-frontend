import { Component, Input, OnInit } from '@angular/core';
import { deleteBlob, downloadBlob } from '../azure/azure.storage';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: any = []
  constructor() { }

  ngOnInit(): void {
  }
  async download(obj: any, cont_name: string) {
    if ("properties" in obj) {
      downloadBlob(cont_name, obj.name)
        .then(res => {
          let link = document.createElement("a")
          link.href = res
          link.download = obj.name
          link.click()
        })
    }
    else {
      let link = document.createElement("a")
      link.href = URL.createObjectURL(obj)
      link.download = obj.name
      link.click()
    }
  }
  async remove(index: number) {
    let conf = confirm("Are you sure you want to delete this file?")
    if (conf) {
      let res = await deleteBlob(this.data[index][4], this.data[index][0].name)
      this.data.splice(index, 1)
    }
  }
}
