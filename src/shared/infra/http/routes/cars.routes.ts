import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';
import { ensureAuthenticate } from '@shared/infra/http/middlewares/ensureAuthenticate';

import { ensureAdmin } from '../middlewares/ensureAdmin';

const carsRoutes = Router();

const upload = multer(uploadConfig);

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

carsRoutes.post(
  '/',
  ensureAuthenticate,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/specifications/:id',
  ensureAuthenticate,
  ensureAdmin,
  createCarSpecificationController.handle
);

carsRoutes.post(
  '/images/:id',
  ensureAuthenticate,
  ensureAdmin,
  upload.array('images'),
  uploadCarImagesController.handle
);

export { carsRoutes };
