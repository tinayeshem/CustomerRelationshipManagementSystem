// This wraps a repo so controllers talk to a small, clean “brain”.
export const makeService = (Repo) => ({
  create: (dto) => Repo.create(dto),
  get:    (id)  => Repo.get(id),
  list:   (f,o) => Repo.list(f,o),
  update: (id,dto) => Repo.update(id, dto),
  remove: (id)  => Repo.remove(id),
});
