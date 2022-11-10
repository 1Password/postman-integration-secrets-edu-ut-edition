import {fetchSecret} from './fetchSecret';
import {jest} from '@jest/globals';

jest.mock('@1password/op-js');
jest.mock('commander');

import { inject, validateCli } from "@1password/op-js";
import { Command } from 'commander';
const program = new Command();

afterEach(() => {
  jest.clearAllMocks();
});

test('fetches secret', async () => {
  inject.data.mockReturnValue("secret");
  const program = new Command();

  const val = await fetchSecret(program, "some path");

  expect(validateCli).toHaveBeenCalledTimes(1);
  expect(inject.data).toHaveBeenCalledTimes(1);

  expect(val).toBe("secret");
  
});
  
  
test('throws error message on CLI validation failure', async () => {
  inject.data.mockReturnValue("secret");

  const cliValidationFailure = "CLI Validation failed";
  validateCli.mockImplementation(() => {
    throw new Error(cliValidationFailure);
  });

  const val = await fetchSecret(program, "some path");

  expect(inject.data).toHaveBeenCalledTimes(0);

  expect(validateCli).toHaveBeenCalledTimes(1);
  expect(program.error).toHaveBeenCalledTimes(1);

  expect(program.error).toHaveBeenCalledWith(cliValidationFailure);
  
});





