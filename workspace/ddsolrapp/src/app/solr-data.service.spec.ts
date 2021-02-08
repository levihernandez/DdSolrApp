import { TestBed } from '@angular/core/testing';

import { SolrDataService } from './solr-data.service';

describe('SolrDataService', () => {
  let service: SolrDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolrDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
