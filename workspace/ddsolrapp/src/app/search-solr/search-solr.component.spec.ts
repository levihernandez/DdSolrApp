import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSolrComponent } from './search-solr.component';

describe('SearchSolrComponent', () => {
  let component: SearchSolrComponent;
  let fixture: ComponentFixture<SearchSolrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSolrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSolrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
