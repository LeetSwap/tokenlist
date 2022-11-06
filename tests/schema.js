const z = require("zod");

const PrimitiveSchema = z.string().or(z.boolean).or(z.number()).nullable();

const ETHAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

const DateTimeStringSchema = z.string().refine(isValidDateTimeString, {
  message:
    "Invalid datetime string or outside supported date range of salesforce (Year 1700 - 4000)",
});

const VersionSchema = z.object({
  major: z.number(),
  minor: z.number(),
  patch: z.number(),
});

const TagSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const TokenInfoSchema = z.object({
  chainId: z.number(),
  address: ETHAddressSchema,
  name: z.string(),
  decimals: z.number(),
  symbol: z.string(),
  logoURI: z.string().optional(),
  tags: z.array(z.string()).optional(),
  extensions: z.record(z.string(), PrimitiveSchema).optional(),
});

const schema = z.object({
  name: z.string().max(20),
  timestamp: DateTimeStringSchema,
  version: VersionSchema,
  tokens: z.array(TokenInfoSchema),
  keywords: z.array(z.string()).optional(),
  logoURI: z.string().optional(),
  tags: z.record(z.string(), TagSchema).optional(),
});

function isValidDateTimeString(input) {
  const d = new Date(input);
  return !isNaN(d.getTime());
}

module.exports = schema;
