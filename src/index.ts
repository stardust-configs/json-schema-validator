import { validate, ValidateArgument } from './validate'

export default async (args: ValidateArgument) => {
  await validate(args)
}
