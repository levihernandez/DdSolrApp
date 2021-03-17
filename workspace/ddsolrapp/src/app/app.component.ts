import { Component } from '@angular/core';

/*
// Create a new RUM Application in Datadog UI: https://app.datadoghq.com/rum/application
// Copy the npm Code snippet and inject below
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: '<Datadog-app-applicationId>',
    clientToken: '<Datadog-app-clientToken>',
    site: 'datadoghq.com',
    service: 'NodeJS-Solr',
    env: 'production',
    version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true
});
*/


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ddsolrapp';
}
