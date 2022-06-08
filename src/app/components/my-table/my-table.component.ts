import { Component, Input, OnInit } from '@angular/core';
import { deleteBlob, downloadBlob, MyFileData, updateMetadata, uploadFile2 } from '../azure/azure.storage';
@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})
export class MyTableComponent implements OnInit {
  @Input() data: MyFileData[] = []
  @Input() container: string;
  @Input() isHome = false;
  @Input() isBottom = false
  constructor() { }

  ngOnInit(): void {
  }
  async download(obj: MyFileData) {
      downloadBlob(obj.container, obj.fileName).then(res => {
        let link = document.createElement("a")
        link.href = res
        link.download = obj.fileName
        link.click()
      })
  }
  async remove(index: number) {
    let conf = confirm("Are you sure you want to delete this file?")
    if (conf) {
      let res = await deleteBlob(this.container, this.data[index].fileName)
      this.data.splice(index, 1)
    }
  }

  replacefile(fileData: MyFileData){
    let input = document.createElement("input")
    input.type = 'file'
    input.click()
    input.onchange = async (e: any) => {
      let file = e.target.files[0]
      const newFile = fileData;
          await deleteBlob(this.container, fileData.fileName)
          await uploadFile2(newFile, null, file);
          fileData.file = file;
    }
  }

  async selectionChange(fileData: MyFileData, e: any){
    const metadata = fileData;
    delete metadata.file;
    metadata.status = e.value;
    await updateMetadata(fileData.container, fileData.fileName, metadata);
  }
}
