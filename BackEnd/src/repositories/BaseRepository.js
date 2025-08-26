
// This makes a simple DB helper for any model.
export const makeRepo = (Model) => ({
  // make a new thing in the DB
  create: (data) => new Model(data).save(),
  // get one thing by its id
  get:    (id) => Model.findById(id).lean(),
  // get many things, with optional filter/sort/limit
  list:   (filter = {}, opts = {}) =>
    Model.find(filter)
      .sort(opts.sort ?? { createdAt: -1 }) // newest first
      .limit(opts.limit ?? 50)              // don’t overload
      .lean(),
  // change one thing and give me the new version
  update: (id, data) => Model.findByIdAndUpdate(id, data, { new: true }).lean(),
  // delete one thing
  remove: (id) => Model.findByIdAndDelete(id).lean(),
});