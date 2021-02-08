import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {SolrDataService} from '../solr-data.service';
import {Solr} from '../solr';
@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  solr: Solr;

  constructor(
    private route: ActivatedRoute,
    private solrDataService: SolrDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getSolar();
  }

  getSolar(): void {
    var id = this.route.snapshot.paramMap.get('id');
    this.solrDataService.getSolar(id)
      .subscribe(solr => this.solr = solr);
      console.log(id);
  }

  goBack(): void {
    this.location.back();
  }


}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
