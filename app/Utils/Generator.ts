import generator from 'generate-password'
import { generateUsername } from "unique-username-generator"
import { v4 as uuidv4 } from 'uuid'

export default class Generator {
      // vbbbggdfg
      /**
       * Return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10,
       * length - 1) - 1))
       * @param {number} length - The length of the number you want to generate.
       * @returns A random number between 10^(length-1) and 10^(length) - 1
       */
      public static number(length: number): number {
            return Math.floor(
                  Math.pow(10, length - 1) +
                  Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
            )
      }

      /**
       * It generates a random password of a given length.
       * @param {number} length - The length of the password to be generated.
       * @returns A string of random characters.
       */
      public static password(length: number): string {
            return generator.generate({
                  uppercase: true,
                  length
            })
      }
      /**
       * It returns a random string.
       * @returns A promise that resolves to a string.
       */

      public static async id(): Promise<string> {
            return await uuidv4()
      }

      public static username(): string {
            return `@${generateUsername('', 2, 10)}`
      }
}