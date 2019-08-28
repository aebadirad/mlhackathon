/*
  Copyright 2012-2019 MarkLogic Corporation

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const DataHub = require("/data-hub/5/datahub.sjs");
const datahub = new DataHub();
const entity = require('/MarkLogic/entity');
const mapping = {
  '' : fn.QName('http://marklogic.com/entity', 'entity:entity'),
  'character': fn.QName('http://marklogic.com/entity', 'character'),
  starship: fn.QName('http://marklogic.com/entity', 'starship'),
  planet: fn.QName('http://marklogic.com/entity', 'planet')
};

function main(content, options) {

  //grab the doc id/uri
  let id = content.uri;

  //here we can grab and manipulate the context metadata attached to the document
  let context = content.context;

  //let's set our output format, so we know what we're exporting
  let outputFormat = options.outputFormat ? options.outputFormat.toLowerCase() : datahub.flow.consts.DEFAULT_FORMAT;

  //grab the 'doc' from the content value space
  let doc = content.value;


  let dictionary = cts.entityDictionary([
    cts.entity("1", "Luke Skywalker", "Luke Skywalker", "character"),
    cts.entity("1", "Alderaan", "Alderaan", "planet")
  ])

  //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
  let instance = {
    "Article" : entity.enrich(doc, dictionary, "full", mapping)
  }

  // get triples, return null if empty or cannot be found
  let triples =  [];

  //gets headers, return null if cannot be found
  let headers = {};

  //If you want to set attachments, uncomment here


  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.


  //form our envelope here now, specifying our output format
  let envelope = datahub.flow.flowUtils.makeEnvelope(instance, headers, triples, outputFormat);

  let newContent = {};

  //assign our envelope value
  newContent.value = envelope;

  //assign the uri we want, in this case the same
  newContent.uri = id;

  //assign the context we want
  newContent.context = context;

  //now let's return out our content to be written
  return newContent;
}

module.exports = {
  main: main
};
