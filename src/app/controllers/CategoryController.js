const CategoryRepository = require('../repositories/CategoryRepository');

const isValidUUID = require('../utils/isValidUUID');

class CategoryController {
  async index(request, response) {
    const categories = await CategoryRepository.findAll();
    response.json(categories);
  }

  async show(request, response) {
    // Obter Um registro
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid Category ID' });
    }

    const category = await CategoryRepository.findById(id);

    if (!category) {
      // 404 not found
      return response.status(404).json({ error: 'Category not found' });
    }
    return response.json(category);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }
    const category = await CategoryRepository.create({ name });

    response.status(201).json(category);
  }

  async update(request, response) {
    // editar um registro
    const { id } = request.params;
    const { name } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid Category ID' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Category name is required' });
    }

    const categoryExists = await CategoryRepository.findById(id);
    if (!categoryExists) {
      return response.status(404).json({ error: 'Category not found' });
    }

    if (name) {
      const nameExists = await CategoryRepository.findByName(name);
      if (nameExists && nameExists.id !== id) {
        return response.status(400).json({ error: 'This Category Name is already in use' });
      }
    }

    const category = await CategoryRepository.update(id, {
      name,
    });

    response.json(category);
  }

  async delete(request, response) {
    // deletar um registro
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid category ID' });
    }

    try {
      await CategoryRepository.delete(id);
      // 204: No content
      response.sendStatus(204);
    } catch {
      return response.status(409).json({ error: 'Category is being used in another registry' });
    }
  }
}

module.exports = new CategoryController();
