import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Available Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it('should be able to list all available cars', async () => {
    await carsRepositoryInMemory.create({
      name: 'Carro 1',
      description: 'Descrição',
      daily_rate: 100.0,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Audi',
      category_id: '66d41299-a871-4f67-bcf9-f833237caf0f',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars[0]).toHaveProperty('id');
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Carro 1',
      description: 'Descrição',
      daily_rate: 100.0,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Audi',
      category_id: '66d41299-a871-4f67-bcf9-f833237caf0f',
    });

    const cars = await listAvailableCarsUseCase.execute({ brand: car.brand });

    expect(cars[0].brand).toEqual(car.brand);
  });

  it('should be able to list all available cars by category id', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Carro 1',
      description: 'Descrição',
      daily_rate: 100.0,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Audi',
      category_id: '66d41299-a871-4f67-bcf9-f833237caf0f',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: car.category_id,
    });

    expect(cars[0].category_id).toEqual(car.category_id);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Carro 1',
      description: 'Descrição',
      daily_rate: 100.0,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Audi',
      category_id: '66d41299-a871-4f67-bcf9-f833237caf0f',
    });

    const cars = await listAvailableCarsUseCase.execute({ name: car.name });

    expect(cars[0].name).toEqual(car.name);
  });
});
