import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Becrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    const throwError = (): never => {
      throw new Error()
    }
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()

  })
})
