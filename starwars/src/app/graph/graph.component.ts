import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import * as $ from 'jquery';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {

  @Input() iri;
  MarkLogicProfile = {

    // LodLive will match connection by the base URL of the query used, so the key must match the URL
    connection: {
      // http matches all http requests, so this will be the only connection settings used
      'http:': {
        endpoint: '/v1/graphs/sparql',
        accepts: 'application/sparql-results+json',
        description: {
          en: 'MarkLogic LodLive'
        }
      }
    },

    // here we define the known relationships so that labels will appear
    arrows: {
      'http://www.w3.org/2002/07/owl#sameAs': 'isSameAs',
      'http://purl.org/dc/terms/isPartOf': 'isPartOf',
      'http://purl.org/dc/elements/1.1/type': 'isType',
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'isType',
      'http://ieee.org/concept/coContrib': 'Contributor To',
      'http://ieee.org/concept/hasAffiliation': 'Has Affiliation',
      'http://www.w3.org/2000/01/rdf-schema#wasBornOn': 'Was Born On',
      'http://www.w3.org/2000/01/rdf-schema#wasTrainedBy': 'Was Trained By',
      'http://www.w3.org/2000/01/rdf-schema#isA': 'is a',
      'http://www.w3.org/2000/01/rdf-schema#fliesStarship': 'flies a starship type',
      'http://www.w3.org/2000/01/rdf-schema#residesOn': 'resides on'
    },

    // this is the default data configuration, this is important.  It informs LodLive how to construct queries and how to read the data that comes back
    default: {
      sparql: {
        allClasses: 'SELECT DISTINCT ?object WHERE {[] < ?object}',
        findSubject: 'SELECT DISTINCT ?subject WHERE { {?subject a <{CLASS}>;<http://purl.org/dc/elements/1.1/title> ?object. FILTER(regex(str(?object),\'{VALUE}\',\'i\'))} UNION {?subject a <{CLASS}>;<http://www.w3.org/2000/01/rdf-schema#label> ?object. FILTER(regex(str(?object),\'{VALUE}\',\'i\'))} UNION {?subject a <{CLASS}>;<http://www.w3.org/2004/02/skos/core#prefLabel> ?object. FILTER(regex(str(?object),\'{VALUE}\',\'i\'))} UNION {?subject a <{CLASS}>; <http://xmlns.com/foaf/0.1/name> ?object. FILTER(regex(str(?object),\'{VALUE}\',\'i\'))} }  LIMIT 1 ',
        documentUri: 'SELECT DISTINCT * WHERE {<{URI}> ?property ?object} ORDER BY ?property',
        document: 'SELECT DISTINCT * WHERE {<{URI}> ?property ?object}',
        bnode: 'SELECT DISTINCT *  WHERE {<{URI}> ?property ?object}',
        inverse: 'SELECT DISTINCT * WHERE {?object ?property <{URI}>.} LIMIT 100',
        inverseSameAs: 'SELECT DISTINCT * WHERE {{?object <http://www.w3.org/2002/07/owl#sameAs> <{URI}> } UNION { ?object <http://www.w3.org/2004/02/skos/core#exactMatch> <{URI}>}}'
      },
      document: {
        className: 'standard',
        titleProperties: [
          'http://www.w3.org/2004/02/skos/core#prefLabel',
          'http://xmlns.com/foaf/0.1/name',
          'http://purl.org/dc/elements/1.1/title',
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#label',
          'http://purl.org/dc/terms/title',
          'http://marklogic.com/entity-services#title'
        ]
      }, // http://www.w3.org/2000/01/rdf-schema#label
    },

    UI: {
      ignoreBnodes: false,
      nodeIcons: [{
        builtin: 'tools'
      }, {
        builtin: 'docInfo'
      }],
      tools: [{
        builtin: 'remove'
      }, {
        builtin: 'rootNode'
      }, {
        builtin: 'expand'
      }],
      // docInfo: function() {},
      nodeHover: function () {
      },
      relationships: {
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
          color: '#000',
          title: 'rdf:type'
        },
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#instance': {
          color: '#000',
          title: 'rdf:instance'
        },
        'http://www.w3.org/2004/02/skos/core#broader': {
          color: '#69C',
          title: 'skos:broader'
        },
        'http://www.w3.org/2004/02/skos/core#narrower': {
          color: '#69C',
          title: 'skos:narrower'
        },
        'http://www.w3.org/2004/02/skos/core#related': {
          color: '#69C',
          title: 'skos:related'
        },
        'http://www.w3.org/2002/07/owl#imports': {
          color: '#FA0527',
          title: 'owl:imports'
        },
        'http://www.w3.org/2002/07/owl#sameAs': {
          color: '#FA0527',
          title: 'owl:sameAs'
        },
        'http://www.w3.org/2000/01/rdf-schema#subClassOf': {
          color: '#FA7F05',
          title: 'rdfs:subClassOf'
        },
        'http://www.w3.org/2000/01/rdf-schema#isDefinedBy': {
          color: '#FF0000',
          title: 'rdfs:isDefinedBy'
        },
        'http://ieee.org/concept/hasAffiliation': {
          color: '#588F27',
          title: 'ieee:hasAffiliation'
        },
        'http://purl.org/dc/elements/1.1/contributor': {
          color: '#04756F',
          title: 'dc:contributor'
        },
        'http://www.w3.org/2000/01/rdf-schema#wasBornOn': {
          color: '#0000FF',
          title: 'rdf:wasBornOn'
        },
        'http://www.w3.org/2000/01/rdf-schema#trainedBy': {
          color: '#00FF00',
          title: 'rdf:trainedBy'
        },
        'http://www.w3.org/2000/01/rdf-schema#fliesStarship': {
          color: '#ffffff',
          title: 'rdf:fliesStarship'
        },
        'http://www.w3.org/2000/01/rdf-schema#isA': {
          color: '#ffff00',
          title: 'rdf:fliesStarship'
        },
        'http://www.w3.org/2000/01/rdf-schema#isRelatedTo': {
          color: '#551a8b',
          title: 'rdf:isRelatedTo'
        }
      }
    },

    endpoints: {
      all: '',
      jsonp: false
    }
  };

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const ll = window['jQuery']('.ml-lodlive');
    ll['lodlive']({ profile: this.MarkLogicProfile, firstUri: this.iri, ignoreBnodes: true });
  }

}
