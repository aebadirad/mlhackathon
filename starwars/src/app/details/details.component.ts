import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AppService } from '../app.service';

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent implements OnInit {
  uri: string;
  doc: any;

  constructor(private route: ActivatedRoute, private app: AppService) {}

  ngOnInit() {
    this.uri = this.route.snapshot.queryParamMap.get("uri");
    this.app.getDoc(this.uri).subscribe(doc => this.doc = doc);
  }

  getIri(){
    let iri = '';
    if(this.doc.type == 'character') {
      iri = "http://marklogic.com/mlworld/Character-0.0.1/Character/";
    }
    if(this.doc.type == 'planets') {
      iri = "http://marklogic.com/mlworld/Planets-0.0.1/Planets/";
    }
    if(this.doc.type == 'species') {
      iri = "http://marklogic.com/mlworld/Species-0.0.1/Species/";
    }
    if(this.doc.type == 'starships') {
      iri = "http://marklogic.com/mlworld/Starships-0.0.1/Starships/";
    }
    if(this.doc.type == 'article') {
      iri = "http://marklogic.com/mlworld/Article-0.0.1/Article/";
    }
    return iri;
  }

  getIcon(result): string {
    let icon;
    if (result.type === "character") {
      if (result.gender && result.gender !== "none") {
        icon = `fa-${result.gender}`;
      } else {
        icon = "fa-user";
      }
    } else if (result.type === "planet") {
      icon = "fa-globe";
    } else if (result.type === "starship") {
      icon = "fa-space-shuttle";
    }
    return icon;
  }

  getImageUrl(name) {
    return `url('/assets/images/${encodeURIComponent(name)}.png')`;
  }
}
