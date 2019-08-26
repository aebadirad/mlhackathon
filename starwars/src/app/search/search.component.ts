import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  results: any;

  constructor(private appService: AppService) { }

  searchForm: FormGroup = new FormGroup({
    q: new FormControl('')
  });

  ngOnInit() {
    this.search();
  }

  search() {
    this.appService.search(this.searchForm.value.q).subscribe(res => {
      this.results = res;
    });
  }

  getIcon(result): string {
    let icon;
    if (result.type === 'character') {
      if (result.gender && result.gender !== 'none') {
        icon = `fa-${result.gender}`;
      }
      else {
        icon = 'fa-user';
      }
    }
    else if (result.type === 'planet') {
      icon = 'fa-globe';
    }
    else if (result.type === 'starship') {
      icon = 'fa-space-shuttle';
    }
    return icon;
  }

  getImageUrl(name) {
    return `url('/assets/images/${encodeURIComponent(name)}.png')`;
  }
}
