import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AllContainers, listBlob } from '../azure/azure.storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
  constructor(public authService: AuthService, private changeDetection: ChangeDetectorRef) { }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fillCont(AllContainers.coverpage)
    this.fillCont(AllContainers.budget)
    this.fillCont(AllContainers.contents)
    this.fillCont(AllContainers.abstract)
    this.fillCont(AllContainers.performance)
    this.fillCont(AllContainers.purpose)
    this.fillCont(AllContainers.allfiles)
    
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




  async fillCont(name: string) {
   // await this.create(name);
    let files = await listBlob(name)
    console.log(name, files)
    files.map(el => {
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

}
