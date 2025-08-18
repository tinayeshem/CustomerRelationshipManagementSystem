
export function toUi(doc) {
  if (!doc) return doc;
  const o = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
  o.id = o._id; delete o._id;
  return o;
}


//primary purpose is to transform a Mongoose document from its database representation into a clean,
//  simple JavaScript object suitable for use in a user interface (UI) or for sending to a client as an API response.