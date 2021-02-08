import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SolrDataService} from './solr-data.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private solrDataService: SolrDataService) {}  
  
  solars = [];
  getSolars(term: string): void {
    this.solrDataService.searchSolr(term)
    .subscribe(solars => this.solars = solars);
  }
}
