import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
export interface Result {
  name: string;
}

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return this.http
      .get<any>(
        `/v1/search?q=${query}&format=json&options=character&pageLength=300&collection=entity&view=all`
      )
      .pipe(
        map(result => result.results),
        map((results: Array<any>) =>
          results.map(result =>
              this.getInstance(result.extracted.content[0], result.uri)
          )
        )
      );
  }

  searchDoc(query: string): Observable<any> {
    return this.http
      .get<any>(
        `/v1/search?q=${query}&format=json&options=character&pageLength=5&collection=article&view=all`
      )
      .pipe(
        map(result => result)
      );
  }

  getDoc(uri: string): Observable<any> {
    return this.http.get<any>(`/v1/documents?uri=${uri}&transform=storydoc`);
  }

  getInstance(result, uri) {
    if (result.Character) {
      return { ...result.Character, type: "character", uri: uri };
    } else if (result.Planets) {
      return { ...result.Planets, type: "planet", uri: uri };
    } else if (result.Starships) {
      return { ...result.Starships, type: "starship", uri: uri };
    } else if (result.Species) {
      return { ...result.Species, type: "species", uri: uri };
    } else if (result.Article) {
      return {...result.Article, type: "article", uri: uri };
    }
  }

  getUris() {
    return this.http.get<any>(`/v1/resources/loaded`);
  }
}
