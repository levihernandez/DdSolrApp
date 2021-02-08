import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { Solr } from '../solr';
import {SolrDataService} from '../solr-data.service';

@Component({
  selector: 'app-search-solr',
  templateUrl: './search-solr.component.html',
  styleUrls: ['./search-solr.component.css']
})
export class SearchSolrComponent implements OnInit {
  solr: Observable<Solr[]>;
  private searchTerms = new Subject<string>();
  constructor(private solrDataService: SolrDataService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    console.log("2) SearchSolrComponent.search(term: string) ", term);
    this.searchTerms.next(term);
  }

  solars = [];
  getSolars(term: string): void {
    this.solrDataService.searchSolr(term)
    .subscribe(solars => this.solars = solars);
  }

  ngOnInit(): void {
    this.solr = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.solrDataService.searchSolr(term)),
    );

  }

}
