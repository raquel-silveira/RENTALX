import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Carro 1',
      description: 'Descrição',
      daily_rate: 100.0,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Audi',
      category_id: '66d41299-a871-4f67-bcf9-f833237caf0f',
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: 'Especificação',
      description: 'Descrição',
    });

    const specificationsCar = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id: [specification.id],
    });

    expect(specificationsCar).toHaveProperty('specifications');
    expect(specificationsCar.specifications.length).toBe(1);
  });

  it('should not be able to add a new specification if car does not exists', async () => {
    expect(async () => {
      await createCarSpecificationUseCase.execute({
        car_id: '123',
        specifications_id: ['123'],
      });
    }).rejects.toEqual(new AppError('Car does not exists'));
  });
});
