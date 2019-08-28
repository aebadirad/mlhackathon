import {Component, Input, OnInit, OnChanges, Sanitizer, SecurityContext} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { AppService } from "../app.service";

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: "app-story",
  templateUrl: "./story.component.html",
  styleUrls: ["./story.component.scss"]
})
export class StoryComponent implements OnInit {
  @Input() uri: string;
  doc: any;
  lukeDoc: any;
  docs = {};
  urisToLoad = [
    "/characters/1.json",
    "/characters/2.json",
    "/characters/3.json",
    "/characters/4.json",
    "/characters/5.json",
    "/characters/6.json",
    "/characters/10.json",
    "/characters/13.json",
    "/characters/14.json",
    "/characters/16.json",
    "/starships/12.json",
    "/starships/9.json",
    "/starships/10.json",
    "/starships/3.json",
    "/starships/2.json",
    "/planets/1.json",
    "/planets/2.json",
    "/planets/3.json"
  ];
  constructor(private app: AppService, private http: HttpClient, private sanitizer: Sanitizer) {}
  results: any;
  article: any;
  articleTitle: any;
  searchForm: FormGroup = new FormGroup({
    q: new FormControl('')
  });

  search() {
    this.app.searchDoc(this.searchForm.value.q).subscribe(res => {
      let results = [];
      for(let result of res) {
        let snippet = "";
        for( let match of result.matches[0]['match-text']){
         if(match instanceof Object){
          snippet +=  '<span class="highlight starships"><b>' +match.highlight+"</b></span>";
         } else {
           snippet += match;
         }
         snippet += " ";
        }
        results.push({
          uri: result.uri,
          snippet: snippet
        })
      }
      this.results = results;
      console.log(results);
    });
  }

  getArticle(uri: string) {
    const parser = new DOMParser();
    var oSerializer = new XMLSerializer();
    let xmlDoc;
    var self = this;
    this.article = {};
    this.http.get(`/v1/documents?uri=${encodeURI(uri)}`, { responseType: 'text' }).subscribe(doc => {

        xmlDoc = parser.parseFromString(doc, "text/xml");
        self.articleTitle = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        let art = xmlDoc.getElementsByTagName("text")[0];
        self.article = oSerializer.serializeToString(art);
       //self.article = doc;
      }
    );
  }

  public getSafeContent(): SafeHtml {
    window.art.innerHTML = this.article;
    return "";
  }

  getLukeDoc(){
    const uri = this.getUri('luke');
    this.app.getDoc(uri).subscribe(doc => {
      this.lukeDoc = doc;
    });
  }

  ngOnInit() {
    this.getLukeDoc();
    if (this.uri) {
      this.app.getDoc(this.uri).subscribe(doc => (this.doc = doc));
    } else {
      this.refresh();
    }
  }

  refresh() {
    this.urisToLoad.forEach(uri => {
      this.app.getDoc(uri).subscribe(doc => {
        if (this.docs[uri] && this.docs[uri].name != doc.name) {
          this.docs[uri] = null;
          setTimeout(() => {
            this.docs[uri] = doc;
          }, 0);
        } else if (!this.docs[uri]) {
          this.docs[uri] = doc;
        }
      });
    });
  }

  getHeShe(){
    if(this.doc && this.doc.gender === 'female'){
      return "She";
    } else if (this.doc && this.doc.gender === 'male'){
      return "He";
    } else {
      return "They";
    }
  }

  s(name: string) {
    const uri = this.getUri(name);
    return this.docs && this.docs[uri] && this.docs[uri].name;
  }

  c(name: string) {
    const uri = this.getUri(name);
    return this.docs && this.docs[uri] && this.docs[uri].type;
  }

  u(name: string) {
    const uri = this.getUri(name);
    return this.docs && this.docs[uri].uri;
  }

  descSet() {
      if (this.lukeDoc && this.lukeDoc.description &&  this.lukeDoc.description.length > 0) {
        return true;
      } else {
        return false;
      }
  }


  getUri(name: string) {
    switch (name) {
      case "luke": {
        return "/characters/1.json";
      }

      case "c3p0": {
        return "/characters/2.json";
      }

      case "r2d2": {
        return "/characters/3.json";
      }

      case "vader": {
        return "/characters/4.json";
      }

      case "leia": {
        return "/characters/5.json";
      }

      case "owenlars": {
        return "/characters/6.json";
      }

      case "obiwan": {
        return "/characters/10.json";
      }

      case "chewy": {
        return "/characters/13.json";
      }

      case "solo": {
        return "/characters/14.json";
      }

      case "jabba": {
        return "/characters/16.json";
      }

      case "xwing": {
        return "/starships/12.json";
      }

      case "corvette": {
        return "/starships/2.json";
      }

      case "stardestroyer": {
        return "/starships/3.json";
      }

      case "deathstar": {
        return "/starships/9.json";
      }

      case "falcon": {
        return "/starships/10.json";
      }

      case "tatooine": {
        return "/planets/1.json";
      }

      case "alderaan": {
        return "/planets/2.json";
      }

      case "yavin": {
        return "/planets/3.json";
      }
    }
  }

  get luke() {
    return this.s('luke');
  }
  get c3p0() {
    return this.s('c3p0');
  }
  get r2d2() {
    return this.s('r2d2');
  }
  get vader() {
    return this.s('vader');
  }
  get leia() {
    return this.s('leia');
  }
  get owenlars() {
    return this.s('owenlars');
  }
  get obiwan() {
    return this.s('obiwan');
  }
  get chewy() {
    return this.s('chewy');
  }
  get solo() {
    return this.s('solo');
  }
  get jabba() {
    return this.s('jabba');
  }
  get corvette() {
    return this.s('corvette');
  }
  get xwing() {
    return this.s('xwing');
  }
  get stardestroyer() {
    return this.s('stardestroyer');
  }
  get deathstar() {
    return this.s('deathstar');
  }
  get falcon() {
    return this.s('falcon');
  }
  get tatooine() {
    return this.s('tatooine');
  }
  get alderaan() {
    return this.s('alderaan');
  }
  get yavin() {
    return this.s('yavin');
  }
}

