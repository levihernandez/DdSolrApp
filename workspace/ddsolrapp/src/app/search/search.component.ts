import { Component, OnInit } from '@angular/core';
import { SolrDataService } from '../solr-data.service';
import { Solr } from '../solr';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  solrdata: Solr[];

  constructor(private solrService: SolrDataService) { }

  ngOnInit() {
    this.getSolr();
  }

  getSolr(): void {
    this.solrService.getSolr()
    .subscribe(solrdata => this.solrdata = solrdata );
  }

}
