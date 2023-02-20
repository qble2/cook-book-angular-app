import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Ingredient } from "../_model/ingredient.model";
import { Metadata } from "../_model/metadata-model";

@Injectable({
  providedIn: "root",
})
export class MetadataService {
  constructor(private http: HttpClient) {}

  public getMetadata(): Observable<Metadata> {
    // return this.http.get<Metadata>(`${environment.apiBaseUrl}/api/metadata`);
    return this.http
      .get<Metadata>(`${environment.apiBaseUrl}/api/metadata`)
      .pipe(
        map((data: Metadata) => {
          data["availableIngredients"].forEach((ingredient: Ingredient) => {
            delete ingredient["_links"];
          });
          return data;
        })
      );
  }
}
