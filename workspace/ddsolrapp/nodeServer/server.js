const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const baseUrl = 'http://localhost:8983/solr/technology/select?facet.field=_version_&facet.field=id&facet.field=technology.alias&facet.field=technology.name&facet.field=technology.os_support.bug_report_url&facet.field=technology.os_support.distrib_codename&facet.field=technology.os_support.distrib_description&facet.field=technology.os_support.distrib_id&facet.field=technology.os_support.distrib_release&facet.field=technology.os_support.home_url&facet.field=technology.os_support.id&facet.field=technology.os_support.id_like&facet.field=technology.os_support.name&facet.field=technology.os_support.pretty_name&facet.field=technology.os_support.support_url&facet.field=technology.os_support.ubuntu_codename&facet.field=technology.os_support.version&facet.field=technology.os_support.version_codename&facet.field=technology.os_support.version_id&facet.field=technology.tech_conf&facet.field=technology.tech_confdir&facet.field=technology.tech_firstconf&facet.field=technology.tech_type&facet.field=technology.tech_version&facet=on&fl=technology.os_support.version%2Ctechnology.os_support.support_url%2Ctechnology.os_support.version_id%2Ctechnology.os_support.distrib_release%2Ctechnology.tech_version%2Ctechnology.tech_firstconf%2Ctechnology.os_support.id%2Ctechnology.name%2Ctechnology.tech_type%2Ctechnology.os_support.version_codename%2Cid%2Ctechnology.os_support.distrib_description%2Ctechnology.os_support.distrib_codename%2Ctechnology.os_support.distrib_id%2Ctechnology.os_support.bug_report_url%2Ctechnology.os_support.pretty_name%2Ctechnology.os_support.ubuntu_codename%2Ctechnology.os_support.name%2Ctechnology.alias%2Ctechnology.os_support.home_url%2Ctechnology.os_support.id_like%2Ctechnology.tech_confdir%2C_version_%2Ctechnology.tech_conf&q='
var result;

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.route('/api/q:attributes').get((req, resultToSend) => {
  var attributes = req.params['attributes'];
  //substring deletes first character of the string so the ":" will go away
  attributes = attributes.substring(1)
  var attributesSplitted = attributes.split(':');
  var vals = attributesSplitted[1];
  var keyword = attributesSplitted[0];

  //http request to the solr API
  http.get(`${baseUrl}${keyword}:${vals}`, (res) => {

    res.setEncoding('utf8');
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      resultToSend.send({body});
      console.log(`[UPDATE]: results based on ${keyword}:${vals} search just transfered to the frontend app`);
    });
  });
});

app.route('/api/sameCategoryBoolean:attributes').get((req, resultToSend) => {
  var attributes = req.params['attributes'];
  //substring deletes first character of the string so the ":" will go away
  attributes = attributes.substring(1)
  var attributesSplitted = attributes.split('+');
  var query = attributesSplitted[0];
  var type = attributesSplitted[1];

  //encode the url with browser standards for every case
  var encodedQuery = encodeURI(query);

  //http request to the solr API
  http.get(`${baseUrl}${encodedQuery}`, (res) => {
    res.setEncoding('utf8');
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      resultToSend.send({body});
      console.log(`[UPDATE]: results based on boolean combination of ${type} search just transfered to the frontend app`);
    });
  });
});


app.route('/api/differentCategoryBoolean:attributes').get((req, resultToSend) => {
  var query = req.params['attributes'];
  //substring deletes first character of the string so the ":" will go away
  query = query.substring(1)

  //encode the url with browser standards for every case
  var encodedQuery = encodeURI(query);

  console.log(query);
  console.log(`${baseUrl}${encodedQuery}`);

  //http request to the solr API
  http.get(`${baseUrl}${encodedQuery}`, (res) => {
    res.setEncoding('utf8');
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      resultToSend.send({body});
      console.log(`[UPDATE]: results based on boolean combination of different types of search just transfered to the frontend app`);
    });
  });
});



//the server listens here
app.listen(8000, () => {
  console.log('[UPDATE]:Server now listens for incoming connections at port:8000');
});
