import type { ZodType } from 'zod'

export const toJsonSchema = (schema: ZodType) => {
  return schema.toJSONSchema({
    override({ jsonSchema }) {
      delete jsonSchema.propertyNames
    },
  })
}
