import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService : RecipeService){}

  storeRecipes(){
    const recipes= this.recipeService.getRecipes();
    return this.http.put('https://ng-complete-guide-6805f-default-rtdb.firebaseio.com/recipes.json',recipes)
    .subscribe(response=>{
      console.log(response);
    })

  }

}