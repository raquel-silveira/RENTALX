import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it('should be able to create a new category', async () => {
    await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category description test',
    });

    const category = await categoriesRepositoryInMemory.findByName(
      'Category Test'
    );

    expect(category).toHaveProperty('id');
  });

  it('should not be able to create a new category if category already exists', async () => {
    await createCategoryUseCase.execute({
      name: 'Category Test',
      description: 'Category description test',
    });

    await expect(
      createCategoryUseCase.execute({
        name: 'Category Test',
        description: 'Category description test',
      })
    ).rejects.toEqual(new AppError('Category already exists!'));
  });
});
