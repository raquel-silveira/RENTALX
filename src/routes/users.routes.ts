import { Router } from 'express';

import { CreateUsersController } from '../modules/accounts/useCases/createUser/CreateUserController';

const usersRoutes = Router();

const createUserController = new CreateUsersController();

usersRoutes.post('/', createUserController.handle);

export { usersRoutes };
