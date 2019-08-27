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

var sem = require("/MarkLogic/semantics.xqy");
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

  //gets headers, return null if cannot be found
  let headers = datahub.flow.flowUtils.getHeaders(doc) || {};


  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.

  // the original source documents
  let attachments = source;
  let name = source.name ? xs.string(source.name) : null;
  let age = source.age ? xs.string(source.age) : null;
  let description = source.description ? xs.string(source.description) : xs.string(source.name);
  let gender = source.gender ? xs.string(source.gender) : null;
  let id = source.id ? xs.integer(source.id) : null;

  let force = null;
  let trainedBy = null;

  let forceUsersDoc = fn.head(cts.search(cts.andQuery([name, cts.collectionQuery('Wookieepedia')])));
  if(forceUsersDoc){
    force = fn.head(forceUsersDoc.xpath('//*[self::jedi or self::sith][name = "'+name+'"]/name()'));
    trainedBy = fn.head(forceUsersDoc.xpath('//*[self::jedi or self::sith][name = "'+name+'"]/trainedBy/text()'));
  }

  let trainedById = fn.head(cts.uris('', [], cts.andQuery([cts.wordQuery(trainedBy), cts.collectionQuery('Character')])));
  if(trainedById){
    trainedById = trainedById.toString();
  }

  if(trainedById && trainedById.length > 0){
    trainedById = trainedById.replace(/[^\d]+/g, '');
    trainedBy = makeReferenceObject("Character", "http://marklogic.com/mlworld/Character-0.0.1/Character/" + trainedById);
  }

  if(!force) {
    force = "none";
  }

  force = xs.string(force);

  let homeworld;
  if (source.homeworld) {
    let homeworldId = source.homeworld.replace(/[^\d]+/g, '');
    homeworld = makeReferenceObject("Planets", "http://marklogic.com/mlworld/Planets-0.0.1/Planets/" + homeworldId);
  }

  let species = [];
  if (source.species) {
    source.species.map(function(s) {
      let speciesId = s.replace(/[^\d]+/g, '');
      species.push(makeReferenceObject('Species', 'http://marklogic.com/mlworld/Species-0.0.1/Species/' + speciesId));
    });
  }

  let starships = [];
  if (source.starships) {
    source.starships.map(function(s) {
      let starshipId = s.replace(/[^\d]+/g, '');
      starships.push(makeReferenceObject('Starships', 'http://marklogic.com/mlworld/Starships-0.0.1/Starships/' + starshipId));
    });
  }

  let relatives = [];
  if (source.relatives) {
    source.relatives.map(function(s) {
      let relativeId = s.replace(/[^\d]+/g, '');
      relatives.push(makeReferenceObject('relatives', 'http://marklogic.com/mlworld/Character-0.0.1/Character/' + relativeId));
    });
  }


  // return the instance object
  let instance = {
    '$attachments': attachments,
    '$type': 'Character',
    '$version': '0.0.1',
    'name': name,
    'age': age,
    'description': description,
    'gender': gender,
    'id': id,
    'homeworld': homeworld,
    'species': species,
    'starships': starships,
    'force': force,
    'trainedby': trainedBy,
    'relatives': relatives
  };

  // get triples, return null if empty or cannot be found
  let triples = [];
  //starships flown
  if(starships && starships.length > 0) {
    for(let starship of starships) {
      triples.push(sem.triple(sem.iri("http://marklogic.com/mlworld/Character-0.0.1/Character/"+source.id), sem.iri("http://www.w3.org/2000/01/rdf-schema#fliesStarship"), sem.iri(starship['$ref'])));
    }
  }

  if(relatives && relatives.length > 0) {
    for(let relative of relatives) {
      triples.push(sem.triple(sem.iri("http://marklogic.com/mlworld/Character-0.0.1/Character/"+source.id), sem.iri("http://www.w3.org/2000/01/rdf-schema#isRelatedTo"), sem.iri(relative['$ref'])));
    }
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
