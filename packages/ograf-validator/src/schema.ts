/**
 * OGraf Manifest JSON Schema
 *
 * Based on the EBU OGraf Graphics Definition v1 specification.
 * Reference: https://github.com/ebu/ograf/blob/main/v1/specification/docs/Specification.md
 *
 * This is a simplified schema for MVP validation.
 * TODO: Pull the full schema from the official repo at build time.
 */
export const OGRAF_MANIFEST_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: ["id", "version", "name", "main"],
  properties: {
    id: {
      type: "string",
      description: "Unique identifier for the graphic",
      minLength: 1,
    },
    version: {
      type: "string",
      description: "Version of the graphic (semver recommended)",
      minLength: 1,
    },
    name: {
      type: "string",
      description: "Human-readable name of the graphic",
      minLength: 1,
    },
    description: {
      type: "string",
      description: "Description of what the graphic does",
    },
    main: {
      type: "string",
      description:
        "Path to the main entry point (HTML or JS file with Web Component)",
      minLength: 1,
    },
    author: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        url: { type: "string", format: "uri" },
      },
    },
    license: {
      type: "string",
      description: "SPDX license identifier",
    },
    thumbnails: {
      type: "array",
      items: {
        type: "object",
        required: ["src"],
        properties: {
          src: { type: "string" },
          width: { type: "integer", minimum: 1 },
          height: { type: "integer", minimum: 1 },
        },
      },
    },
    stepCount: {
      oneOf: [
        { type: "integer", minimum: 0 },
        { const: "dynamic" },
      ],
      description:
        "Number of steps (0 = auto-play, positive integer = fixed steps, 'dynamic' = runtime-determined)",
    },
    supportsRealTime: {
      type: "boolean",
      description: "Whether the graphic supports real-time rendering",
      default: true,
    },
    supportsNonRealTime: {
      type: "boolean",
      description: "Whether the graphic supports non-real-time rendering",
      default: false,
    },
    schema: {
      type: "object",
      description:
        "GDD (Graphics Data Definition) schema for the graphic's data interface",
    },
    customActions: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: { type: "string", minLength: 1 },
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          schema: { type: "object" },
        },
      },
    },
    renderRequirements: {
      type: "object",
      properties: {
        minWidth: { type: "integer", minimum: 1 },
        minHeight: { type: "integer", minimum: 1 },
        aspectRatio: { type: "string" },
        transparency: { type: "boolean" },
        audio: { type: "boolean" },
      },
    },
  },
  additionalProperties: true,
} as const;
