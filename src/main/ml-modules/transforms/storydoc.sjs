function transform(context, params, content) {
  const instance = content.toObject().envelope.instance;
  const entity = instance.Character || instance.Starships || instance.Planets || instance.Species || instance.Article;
  const doc = Object.assign({}, entity);
  doc.uri = xdmp.nodeUri(content);
  doc.type = Object.keys(instance)[0].toLowerCase();

  if (doc.species) {
      doc.species = doc.species.map(function(s) {
        const speciesId = s.Species.replace('http://marklogic.com/mlworld/Species-0.0.1/Species/', '');
        const d = cts.doc("/species/" + speciesId + ".json");

        if (d) {
          const speciesDoc = d.toObject();
          return speciesDoc.envelope.instance.Species.name;
        }
        else {
          return s;
        }
      });
  }

  if (doc.starships) {
    doc.starships = doc.starships.map(function(s) {
      const starshipsId = s.Starships.replace("http://marklogic.com/mlworld/Starships-0.0.1/Starships/", "");
      const starshipUri = "/starships/" + starshipsId + ".json";
      const d = cts.doc(starshipUri);
      if (d) {
        const starshipsDoc = d.toObject();
        return starshipsDoc.envelope.instance.Starships.name;
      }
      else {
        return s;
      }
    });
  }
  
    if (doc.residents && doc.residents.length > 0) {
    doc.residents = doc.residents.map(function(r) {
      const residentsId = r.Character.replace("http://marklogic.com/mlworld/Character-0.0.1/Character/", "");
      const residentUri = "/characters/" + residentsId + ".json";
      const d = cts.doc(residentUri);
      if (d) {
        const residentsDoc = d.toObject();
        return residentsDoc.envelope.instance.Character.name;
      }
      else {
        return r;
      }
    });
  }

  if (doc.homeworld && doc.homeworld['$ref']) {
      const homeworldId = doc.homeworld['$ref'].replace("http://marklogic.com/mlworld/Planets-0.0.1/Planets/", "");
      const homeworldUri = "/planets/" + homeworldId + ".json";
      const d = cts.doc(homeworldUri);
      if (d) {
        const homeworldDoc = d.toObject();
        doc.homeworld = homeworldDoc.envelope.instance.Planets.name;
      }
  }

    if (doc.trainedby && doc.trainedby['$ref']) {
        const trainedbyId = doc.trainedby['$ref'].replace("http://marklogic.com/mlworld/Character-0.0.1/Character/", "");
        const trainedbyUri = "/characters/" + trainedbyId + ".json";
        const d = cts.doc(trainedbyUri);
        if (d) {
            const trainedbyDoc = d.toObject();
            doc.trainedby = trainedbyDoc.envelope.instance.Character.name;
        }
    }

    if (doc.relatives && doc.relatives.length > 0) {
        doc.relatives = doc.relatives.map(function(r) {
            const relativesId = r.relatives.replace("http://marklogic.com/mlworld/Character-0.0.1/Character/", "");
            const relativeUri = "/characters/" + relativesId + ".json";
            const d = cts.doc(relativeUri);
            if (d) {
                const relativesDoc = d.toObject();
                return relativesDoc.envelope.instance.Character.name;
            }
            else {
                return r;
            }
        });
    }

  return doc;
}

exports.transform = transform;
