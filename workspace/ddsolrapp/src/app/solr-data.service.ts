import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Solr } from './solr';

@Injectable({
  providedIn: 'root'
})
export class SolrDataService {
  private solrApiUrl = 'http://localhost:8000/api/q:';

  stringJson: any;
  stringObject: any;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(
    private http: HttpClient) { }

  /** GET heroes from the server */
  getSolr(): Observable<Solr[]> {
    return this.http.get<Solr[]>(this.solrApiUrl)
      .pipe(
        tap(_ => console.log('1) SolrDataService.getSolr()', this.solrApiUrl)),
        catchError(this.handleError<Solr[]>('getSolr', []))
      );

  }

    /* GET heroes whose name contains search term */
    searchSolr(term: string): Observable<Solr[]> {
      
      if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }
      
      // return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        console.log("3) SolrDataService.searchSolr(term:string) " ,this.solrApiUrl, term);
      /*return this.http.get<Solr[]>(this.solrApiUrl+term).pipe(
        tap(x => x.length ?
           console.log("found solr matching ", term) :
           console.log("no solr matching ", term)),
        catchError(this.handleError<Solr[]>('searchSolr', []))
      );*/
      return this.http.get<Solr[]>(this.solrApiUrl+term).pipe(
        tap(_ => console.log('4) SolrDataService.searchSolr(term:string)', this.solrApiUrl, term)),
        catchError(this.handleError<Solr[]>('searchSolr', []))
      );
    }

    /** GET hero by id. Will 404 if id not found */
    getSolar(id: string): Observable<Solr> {
      const url = `${this.solrApiUrl}${id}`;
      console.log("5) SolrDataService.getSolar(id: string) url id ",url, id);
      return this.http.get<Solr>(url).pipe(
        tap(_ => console.log(`fetched solr id=${id}`)),
        catchError(this.handleError<Solr>(`getSolar id=${id}`))
      );
    }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
