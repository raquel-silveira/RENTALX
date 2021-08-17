import { hash } from 'bcryptjs';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProviderInMemory: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProviderInMemory = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProviderInMemory
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '6641468',
      email: 'email@email.com',
      name: 'Test',
      password: await hash('1234', 8),
    });

    await sendForgotPasswordMailUseCase.execute('email@email.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should be able to create an users tokens', async () => {
    const generateTokenMail = jest.spyOn(usersRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      driver_license: '6641469',
      email: 'email@email.com',
      name: 'Test',
      password: await hash('1234', 8),
    });

    await sendForgotPasswordMailUseCase.execute('email@email.com');

    expect(generateTokenMail).toHaveBeenCalled();
  });

  it('should not be able to send a forgot password mail if user not found', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('incorrect@email.com')
    ).rejects.toEqual(new AppError('User not found'));
  });
});
