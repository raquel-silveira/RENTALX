import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    category_id,
    brand,
    fine_amount,
    license_plate,
    daily_rate,
    description,
    name,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      category_id,
      brand,
      fine_amount,
      license_plate,
      daily_rate,
      description,
      name,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const allCars = this.cars.filter((car) => {
      if (car.available !== true) {
        return false;
      }
      if (brand && car.brand !== brand) {
        return false;
      }
      if (category_id && car.category_id !== category_id) {
        return false;
      }
      if (name && car.name !== name) {
        return false;
      }

      return true;
    });

    return allCars;
  }
}

export { CarsRepositoryInMemory };
