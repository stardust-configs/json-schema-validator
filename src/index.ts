import { validate, ValidateArgument } from './validate'
import consola from 'consola'

export default async (args: ValidateArgument) => {
  await validate(args).catch((error) => {
    consola.error(error)

    throw new Error(error)
  })
}
