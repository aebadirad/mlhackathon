function get(context, params) {

  return xdmp.toJSON(cts.uris());
}

exports.GET = get;