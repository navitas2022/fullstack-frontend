import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllContainers, changeName, deleteBlob, downloadBlob, MyFileData, updateMetadata, uploadFile2 } from '../azure/azure.storage';
@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})
export class MyTableComponent implements OnInit {
  @Input() data: MyFileData[] = []
  @Input() isHome = false;
  @Input() isBottom = false
  @Output() update = new EventEmitter();
  @Input() tableName = '';

  constructor() { }

  ngOnInit(): void {
  }
  async download(obj: MyFileData) {
    const url = await downloadBlob(obj.container, obj.fileName);
    window.open(url, '_blank').focus();
  }
  async remove(index: number) {
    let conf = confirm("Are you sure you want to delete this file?")
    if (conf) {
      let res = await deleteBlob(this.data[index].container, this.data[index].fileName)
   //   this.data.splice(index, 1)
      this.update.emit();
    }
  }

  get trData() {
    const set = new Set();
    const data = [];

    this.data.forEach(x => {
      if (!set.has(x.token) || !this.isHome) {
        set.add(x.token)
        data.push(x);
      }
    })

    return data;

  }

  replacefile(fileData: MyFileData) {
    let input = document.createElement("input")
    input.type = 'file'
    if (fileData.originalContainer === AllContainers.zip) {
      input.accept = ".zip"
    }
    input.click()

    const types = ['application/x-zip', 'application/zip', 'application/x-zip-compressed','application/octet-stream'];


    input.onchange = async (e: any) => {
      let file = e.target.files[0]
      if (!types.includes(file.type) && fileData.originalContainer === AllContainers.zip) {
        return alert("Incorrect file type for Zip Files")
      }
      const newFile = fileData;
      await deleteBlob(fileData.container, fileData.fileName)
      newFile.fileName = changeName(file.name, newFile.token);

      await uploadFile2(newFile, null, file);
      fileData.file = file;
      this.update.emit();
    }
  }

  async selectionChange(fd: MyFileData, e: any) {
    this.data.filter(x => x.token === fd.token).forEach(async (fileData) => {
      const metadata = fileData;
      delete metadata.file;
      metadata.status = e.value;
      await updateMetadata(fileData.container, fileData.fileName, metadata);
    })

  }
}
