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

function main(content, options) {

  //here we can grab and manipulate the context metadata attached to the document
  let context = content.context;

  //let's set our output format, so we know what we're exporting
  let outputFormat = options.outputFormat ? options.outputFormat.toLowerCase() : datahub.flow.consts.DEFAULT_FORMAT;

  //grab the 'doc' from the content value space
  let doc = content.value;

  // let's just grab the root of the document if its a Document and not a type of Node (ObjectNode or XMLNode)
  if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
    doc = fn.head(doc.root);
  }

  //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
  let source = datahub.flow.flowUtils.getInstance(doc).toObject() || {};

  // get triples, return null if empty or cannot be found
  let triples = datahub.flow.flowUtils.getTriples(doc) || [];

  //gets headers, return null if cannot be found
  let headers = datahub.flow.flowUtils.getHeaders(doc) || {};


  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.

  // the original source documents
  let attachments = source;
  let id = source.id ? xs.integer(source.id) : null;
  let name = source.name ? xs.string(source.name) : null;
  let climate = source.climate ? xs.string(source.climate) : null;
  let population = source.population ? xs.string(source.population) : null;
  let rotation_period = source.rotation_period ? xs.string(source.rotation_period) : null;
  let orbital_period = source.rotation_period ? xs.string(source.orbital_period) : null;
  let diameter = source.diameter ? xs.string(source.diameter) : null;
  let terrain = source.terrain ? xs.string(source.terrain) : null;

  let residents = [];
  if (source.residents && source.residents.length > 0) {
    source.residents.map(function(s) {
      let residentId = s.replace(/[^\d]+/g, '');
      residents.push(makeReferenceObject('Character', 'http://marklogic.com/mlworld/Character-0.0.1/Character/' + residentId));
    });
  }

  // return the instance object
  let instance = {
    '$attachments': attachments,
    '$type': 'Planets',
    '$version': '0.0.1',
    'id': id,
    'name': name,
    'climate': climate,
    'population': population,
    'rotation_period' : rotation_period,
    'orbital_period' : orbital_period,
    'diameter' : diameter,
    'terrain': terrain,
    'residents': residents
  }


  //form our envelope here now, specifying our output format
  let envelope = datahub.flow.flowUtils.makeEnvelope(instance, headers, triples, outputFormat);

  let newContent = {};
  //assign our envelope value
  newContent.value = envelope;

  //assign the uri we want, in this case the same
  newContent.uri = content.uri;

  //assign the context we want
  newContent.context = content.context;

  //now let's return out our content to be written
  return newContent;
}

function makeReferenceObject(type, ref) {
  return {
    '$type': type,
    '$ref': ref
  };
}


module.exports = {
  main: main
};
