import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '11be67dc-abbc-471a-a8fa-afee4fd9f7e7',
      name: 'Carro',
      description: 'Teste',
      daily_rate: 100,
      license_plate: 'teste',
      brand: 'Teste',
      category_id: '1234',
      fine_amount: 40,
    });

    const rental = await createRentalUseCase.execute({
      user_id: '1234',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if car is unavailable', async () => {
    expect(async () => {
      const car = await carsRepositoryInMemory.create({
        id: '11be67dc-abbc-471a-a8fa-afee4fd9f7e7',
        name: 'Carro',
        description: 'Teste',
        daily_rate: 100,
        license_plate: 'teste',
        brand: 'Teste',
        category_id: '1234',
        fine_amount: 40,
      });

      await createRentalUseCase.execute({
        user_id: '1234',
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: '1235',
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to create a new rental if there is a rental in progress for user', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '11be67dc-abbc-471a-a8fa-afee4fd9f7e7',
      name: 'Carro',
      description: 'Teste',
      daily_rate: 100,
      license_plate: 'teste',
      brand: 'Teste',
      category_id: '1234',
      fine_amount: 40,
    });

    const secondCar = await carsRepositoryInMemory.create({
      id: '6a1b82c5-77f5-481f-970c-ab868214ca25',
      name: 'Carro 2',
      description: 'Teste 2',
      daily_rate: 100,
      license_plate: 'teste 2',
      brand: 'Teste 2',
      category_id: '1234',
      fine_amount: 40,
    });

    await createRentalUseCase.execute({
      user_id: '1234',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '1234',
        car_id: secondCar.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('There is a rental in progress for user'));
  });

  it('should not be able to create a new rental if invalid return time', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '6a1b82c5-77f5-481f-970c-ab868214ca25',
      name: 'Carro',
      description: 'Teste',
      daily_rate: 100,
      license_plate: 'teste',
      brand: 'Teste',
      category_id: '1234',
      fine_amount: 40,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: '1234',
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalid return time'));
  });
});
