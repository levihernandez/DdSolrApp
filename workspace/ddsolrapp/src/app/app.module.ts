import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SearchSolrComponent } from './search-solr/search-solr.component';
import { SearchDetailComponent } from './search-detail/search-detail.component';
import { JsonStringsPipe } from './json-strings.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchSolrComponent,
    SearchDetailComponent,
    JsonStringsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
