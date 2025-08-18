
export class BaseRepository {
  constructor(Model) { this.Model = Model; }

  async findById(id) { return this.Model.findById(id); }
  async create(payload) { return this.Model.create(payload); }
  async update(id, payload) {
    return this.Model.findByIdAndUpdate(id, payload, { new: true });
  }
  async remove(id) { return this.Model.findByIdAndDelete(id); }
}
