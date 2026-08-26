/**
 * Vendored EBU OGraf v1 JSON Schemas — offline snapshot.
 *
 * Pinned to ebu/ograf commit 8468da15f207384077a0d324af0e3fee20df03c6.
 * Fetched from https://github.com/ebu/ograf/tree/8468da15f207384077a0d324af0e3fee20df03c6/v1/specification/json-schemas
 *
 * The checker normally validates against the live schema (see remote-schema.ts).
 * This snapshot is the fallback for offline / blocked / slow-network use, so it
 * must be the real spec — a hand-written approximation gives wrong answers to
 * exactly the users who cannot reach the network to find out.
 *
 * To refresh: run scripts/refresh-ograf-schemas.mjs and bump PINNED_COMMIT.
 */

export const PINNED_COMMIT = "8468da15f207384077a0d324af0e3fee20df03c6";

export const OGRAF_SCHEMA_ROOT_ID = "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json";

/** Every schema in the set, keyed by $id, ready to hand to ajv.addSchema(). */
export const OGRAF_SCHEMAS: Readonly<Record<string, object>> = {
  "https://ograf.ebu.io/v1/specification/json-schemas/gdd/basic-types.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/basic-types.json",
    "allOf": [
      {
        "if": {
          "properties": {
            "type": {
              "const": "boolean"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "properties": {
            "default": {
              "type": "boolean"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "type": {
              "const": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "properties": {
            "default": {
              "type": "string"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "type": {
              "const": "number"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "properties": {
            "default": {
              "type": "number"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "type": {
              "const": "integer"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "properties": {
            "default": {
              "type": "integer"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "type": {
              "const": "array"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "properties": {
            "items": {
              "type": "object",
              "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json"
            },
            "default": {
              "type": "array"
            }
          },
          "required": [
            "items"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "type": {
              "const": "object"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "properties": {
            "properties": {
              "type": "object",
              "patternProperties": {
                ".": {
                  "type": "object",
                  "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json"
                }
              },
              "additionalProperties": false
            },
            "default": {
              "type": "object"
            }
          },
          "required": [
            "properties"
          ]
        }
      }
    ]
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/gdd/gdd-types.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/gdd-types.json",
    "allOf": [
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "single-line"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "string"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "multi-line"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "string"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "file-path"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "string"
            },
            "gddOptions": {
              "type": "object",
              "properties": {
                "extensions": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "file-path/image-path"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "string"
            },
            "gddOptions": {
              "type": "object",
              "properties": {
                "extensions": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "enum": [
                "string",
                "number",
                "integer"
              ]
            },
            "gddOptions": {
              "type": "object",
              "properties": {},
              "required": [
                "labels"
              ]
            }
          },
          "required": [
            "gddOptions",
            "enum"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select"
            },
            "type": {
              "const": "string"
            }
          },
          "required": [
            "gddType",
            "type"
          ]
        },
        "then": {
          "properties": {
            "enum": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "gddOptions": {
              "type": "object",
              "properties": {}
            }
          },
          "required": [
            "gddOptions",
            "enum"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select"
            },
            "type": {
              "const": "integer"
            }
          },
          "required": [
            "gddType",
            "type"
          ]
        },
        "then": {
          "properties": {
            "enum": {
              "type": "array",
              "items": {
                "type": "integer"
              }
            },
            "gddOptions": {
              "type": "object",
              "properties": {
                "labels": {
                  "type": "object",
                  "propertyNames": {
                    "pattern": "^[0-9]+$"
                  },
                  "patternProperties": {
                    ".": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              }
            }
          },
          "required": [
            "gddOptions",
            "enum"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select"
            },
            "type": {
              "const": "number"
            }
          },
          "required": [
            "gddType",
            "type"
          ]
        },
        "then": {
          "properties": {
            "enum": {
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "gddOptions": {
              "type": "object",
              "properties": {
                "labels": {
                  "type": "object",
                  "propertyNames": {
                    "pattern": "^[0-9,.]+$"
                  },
                  "patternProperties": {
                    ".": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "required": [
            "gddOptions",
            "enum"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select-multiple"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "array"
            },
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "enum": [
                    "string",
                    "number",
                    "integer"
                  ]
                },
                "enum": {
                  "type": "array"
                }
              },
              "required": [
                "type",
                "enum"
              ]
            },
            "gddOptions": {
              "type": "object",
              "properties": {},
              "required": [
                "labels"
              ]
            }
          },
          "required": [
            "gddOptions",
            "items"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select-multiple"
            },
            "items": {
              "properties": {
                "type": {
                  "const": "string"
                }
              },
              "required": [
                "type"
              ]
            }
          },
          "required": [
            "gddType",
            "items"
          ]
        },
        "then": {
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "enum": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            },
            "gddOptions": {
              "type": "object",
              "properties": {}
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select-multiple"
            },
            "items": {
              "properties": {
                "type": {
                  "const": "integer"
                }
              },
              "required": [
                "type"
              ]
            }
          },
          "required": [
            "gddType",
            "items"
          ]
        },
        "then": {
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "enum": {
                  "type": "array",
                  "items": {
                    "type": "integer"
                  }
                }
              }
            },
            "gddOptions": {
              "type": "object",
              "properties": {
                "labels": {
                  "type": "object",
                  "propertyNames": {
                    "pattern": "^[0-9]+$"
                  },
                  "patternProperties": {
                    ".": {
                      "type": "string"
                    }
                  },
                  "additionalProperties": false
                }
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "select-multiple"
            },
            "items": {
              "properties": {
                "type": {
                  "const": "number"
                }
              },
              "required": [
                "type"
              ]
            }
          },
          "required": [
            "gddType",
            "items"
          ]
        },
        "then": {
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "enum": {
                  "type": "array",
                  "items": {
                    "type": "number"
                  }
                }
              }
            },
            "gddOptions": {
              "type": "object",
              "properties": {
                "labels": {
                  "type": "object",
                  "propertyNames": {
                    "pattern": "^[0-9,.]+$"
                  },
                  "patternProperties": {
                    ".": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "color-rrggbb"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "string"
            },
            "pattern": {
              "type": "string",
              "const": "^#[0-9a-f]{6}$"
            }
          },
          "required": [
            "pattern"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "color-rrggbbaa"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "string"
            },
            "pattern": {
              "type": "string",
              "const": "^#[0-9a-f]{8}$"
            }
          },
          "required": [
            "pattern"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "percentage"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "number"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "gddType": {
              "const": "duration-ms"
            }
          },
          "required": [
            "gddType"
          ]
        },
        "then": {
          "properties": {
            "type": {
              "const": "integer"
            }
          }
        }
      }
    ]
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json",
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": [
          "boolean",
          "string",
          "number",
          "integer",
          "array",
          "object"
        ]
      },
      "gddType": {
        "type": "string"
      },
      "gddOptions": {
        "type": "object"
      },
      "hidden": {
        "type": "boolean",
        "description": "When true, the value of this property SHOULD NOT be included when labelling the graphic in a GUI (e.g. in playout or automation UIs). Default is false. Used to keep labels concise by excluding technical or less meaningful fields."
      },
      "order": {
        "type": "number",
        "description": "For UI ordering, lower values should be displayed first"
      }
    },
    "required": [
      "type"
    ],
    "allOf": [
      {
        "$ref": "https://json-schema.org/draft/2020-12/schema"
      },
      {
        "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/gdd-types.json"
      },
      {
        "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/basic-types.json"
      }
    ]
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/gdd/playout-options.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/playout-options.json",
    "type": "object",
    "properties": {
      "client": {
        "type": "object",
        "properties": {
          "duration": {
            "type": [
              "integer",
              "null"
            ],
            "description": "The suggested duration of the template (in milliseconds). null means that it is manually taken out, undefined should be treated as null (this is ignored if steps=0). Defaults to null."
          },
          "steps": {
            "type": "integer",
            "description": "Number of steps in the template. 1 means that there are no steps (ie there's only \"the default step\"). 2 or more means that it can be \"stepped\" (ie 2 means it can be stepped once). -1 means \"infinite\" number of steps. 0 means that the template is \"volatile\" / \"fire and forget\" (template really has no duration, like a bumper). Defaults to 1"
          },
          "dataformat": {
            "type": "string",
            "enum": [
              "json",
              "casparcg-xml"
            ],
            "description": "How the data should be formatted. This is mostly used for the older CasparCG flash-based xml data format. Defaults to \"json\""
          }
        }
      },
      "render": {
        "type": "object",
        "properties": {
          "resolutions": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "patternProperties": {
                "width|height|framerate": {
                  "type": [
                    "number",
                    "object"
                  ],
                  "allOf": [
                    {
                      "if": {
                        "type": "object"
                      },
                      "then": {
                        "properties": {
                          "min": {
                            "type": "number"
                          },
                          "max": {
                            "type": "number"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      "playout": {
        "type": "object"
      }
    }
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
    "type": "object",
    "properties": {
      "$schema": {
        "type": "string",
        "const": "https://ograf.ebu.io/v1/specification/json-schemas/graphics/schema.json",
        "description": "Reference to the JSON-schema for this manifest"
      },
      "id": {
        "type": "string",
        "description": "The id of the Graphic uniquely identifies it. It is recommended to use a reverse domain name notation. For example: com.my-company.my-lowerthird."
      },
      "version": {
        "type": "string",
        "description": "The version of the Graphic. The version SHOULD be alphabetically sortable. Examples: ['0', '1', '2'], ['1.0', '1.1', '1.2'], ['2024-07-01_final', '2024-07-01_final_final2']"
      },
      "main": {
        "type": "string",
        "description": "The main entry point, ie the path to the main javascript file of the Graphic."
      },
      "name": {
        "type": "string",
        "description": "Name of the Graphic"
      },
      "description": {
        "type": "string",
        "description": "(optional) A longer description of the Graphic"
      },
      "author": {
        "type": "object",
        "description": "(optional) About the author",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the author"
          },
          "email": {
            "type": "string",
            "description": "(optional) Email of the author"
          },
          "url": {
            "type": "string",
            "description": "(optional) URL of the author"
          }
        },
        "required": [
          "name"
        ],
        "patternProperties": {
          "^v_.*": {}
        },
        "additionalProperties": false
      },
      "customActions": {
        "type": "array",
        "description": "Custom Actions that can be invoked on the Graphic.",
        "items": {
          "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/lib/action.json"
        }
      },
      "actionDurations": {
        "type": "array",
        "description": "Static animation durations for actions, expressed in milliseconds.",
        "items": {
          "description": "Static animation duration metadata for an action.",
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "type": {
                  "const": "playAction"
                },
                "duration": {
                  "type": "integer",
                  "description": "The animation duration in milliseconds. A value of -1 indicates that the duration is dynamic or unknown.",
                  "minimum": -1
                },
                "steps": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "description": "A step-specific playAction animation duration.",
                    "properties": {
                      "step": {
                        "type": "integer",
                        "description": "The zero-based target step number. When omitted, this duration applies to target steps not explicitly listed.",
                        "minimum": 0
                      },
                      "duration": {
                        "type": "integer",
                        "description": "The animation duration in milliseconds. A value of -1 indicates that the duration is dynamic or unknown.",
                        "minimum": -1
                      }
                    },
                    "required": [
                      "duration"
                    ],
                    "patternProperties": {
                      "^v_.*": {}
                    },
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "type",
                "duration"
              ],
              "patternProperties": {
                "^v_.*": {}
              },
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "const": "updateAction"
                },
                "duration": {
                  "type": "integer",
                  "description": "The animation duration in milliseconds. A value of -1 indicates that the duration is dynamic or unknown.",
                  "minimum": -1
                }
              },
              "required": [
                "type",
                "duration"
              ],
              "patternProperties": {
                "^v_.*": {}
              },
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "const": "stopAction"
                },
                "duration": {
                  "type": "integer",
                  "description": "The animation duration in milliseconds. A value of -1 indicates that the duration is dynamic or unknown.",
                  "minimum": -1
                }
              },
              "required": [
                "type",
                "duration"
              ],
              "patternProperties": {
                "^v_.*": {}
              },
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "const": "customAction"
                },
                "customActionId": {
                  "type": "string",
                  "description": "The id of the custom action as defined in customActions."
                },
                "duration": {
                  "type": "integer",
                  "description": "The animation duration in milliseconds. A value of -1 indicates that the duration is dynamic or unknown.",
                  "minimum": -1
                }
              },
              "required": [
                "type",
                "customActionId",
                "duration"
              ],
              "patternProperties": {
                "^v_.*": {}
              },
              "additionalProperties": false
            }
          ]
        }
      },
      "supportsRealTime": {
        "type": "boolean",
        "description": "Indicates if the Graphic supports real-time rendering"
      },
      "supportsNonRealTime": {
        "type": "boolean",
        "description": "Indicates if the Graphic supports non-real-time rendering. Note: If true, the Graphic must implement the 'goToTime()' and the 'setActionsSchedule()' methods."
      },
      "stepCount": {
        "type": "number",
        "description": "The number of steps a Graphic consists of. If the Graphic is simply triggered by a play, then a stop, this is considered a stepCount of 1 (which is the default behavior if left undefined). A value of -1 indicates that a Graphic as a dynamic/unknown number of steps.",
        "default": 1,
        "minimum": -1
      },
      "schema": {
        "description": "The schema is used by a Graphic to define the data parameters of the 'update' method.",
        "type": "object",
        "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json"
      },
      "renderRequirements": {
        "description": "A list of requirements that this Graphic has for the rendering environment. At least one of the requirements must be met for the graphic to be expected to work.",
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "resolution": {
              "description": "If set, specifies requirements for the resolution of the Renderer.",
              "type": "object",
              "properties": {
                "width": {
                  "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/number.json"
                },
                "height": {
                  "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/number.json"
                }
              }
            },
            "frameRate": {
              "description": "If set, specifies requirements for frame rate of the Renderer. Example: 60 fps",
              "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/number.json"
            },
            "accessToPublicInternet": {
              "description": "If set, specifies requirement on whether the renderer has access to the public internet or not.",
              "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/boolean.json"
            },
            "engine": {
              "description": "Minimum required version(s) of the rendering engine. At least one listed engine requirement should be satisfied by the renderer (e.g. type CEF with version.min 139).",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "description": "Identifier of the rendering engine (e.g. CEF, Gecko). Vendor-specific types are allowed."
                  },
                  "version": {
                    "type": "object",
                    "description": "Minimum engine version",
                    "properties": {
                      "min": {
                        "type": "string",
                        "description": "Minimum required version. Format is engine-specific (e.g. CEF branch number as string \"139\", or semver \"120.0.5\")."
                      }
                    },
                    "required": [
                      "min"
                    ]
                  }
                },
                "required": [
                  "type",
                  "version"
                ]
              }
            }
          },
          "patternProperties": {
            "^v_.*": {}
          },
          "additionalProperties": false
        }
      },
      "thumbnails": {
        "description": "Optional list of thumbnail images for the Graphic. Each entry references an image file (PNG, JPG, GIF, or webp) and may specify its resolution so UIs can choose or scale appropriately.",
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "file": {
              "type": "string",
              "description": "Path to the image file, relative to the manifest or absolute. Allowed formats: PNG, JPG, GIF, webp."
            },
            "resolution": {
              "type": "object",
              "description": "Resolution of the image in pixels. When present, the UI can derive aspect ratio (e.g. width/height) and choose or scale the thumbnail appropriately.",
              "properties": {
                "width": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "Width in pixels."
                },
                "height": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "Height in pixels."
                }
              },
              "required": [
                "width",
                "height"
              ]
            }
          },
          "required": [
            "file"
          ],
          "patternProperties": {
            "^v_.*": {}
          },
          "additionalProperties": false
        }
      }
    },
    "required": [
      "$schema",
      "id",
      "name",
      "main",
      "supportsRealTime",
      "supportsNonRealTime"
    ],
    "patternProperties": {
      "^v_.*": {}
    },
    "additionalProperties": false
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/lib/action.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/lib/action.json",
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "The identity of the action. The id must be unique within the graphic."
      },
      "name": {
        "type": "string",
        "description": "The name of the action. This is displayed to the user."
      },
      "description": {
        "type": "string",
        "description": "A longer description of the action. This is displayed to the user."
      },
      "schema": {
        "description": "The schema of the action. This is used to validate the action parameters as well as auto-generate a GUI for the action. If the action does not require any parameters, set this to null.",
        "oneOf": [
          {
            "type": "object",
            "$ref": "https://ograf.ebu.io/v1/specification/json-schemas/gdd/object.json"
          },
          {
            "type": "null"
          }
        ],
        "example": {
          "actionParameter": "example-string"
        }
      }
    },
    "required": [
      "id",
      "name"
    ],
    "patternProperties": {
      "^v_.*": {}
    },
    "additionalProperties": false
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/boolean.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/boolean.json",
    "type": "object",
    "description": "The boolean constraint is used to specify a constraint for a boolean property. (Inspired by https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#constrainboolean)",
    "properties": {
      "exact": {
        "description": "A boolean specifying a specific, required, value the property must have to be considered acceptable.",
        "type": "boolean"
      },
      "ideal": {
        "description": "A boolean specifying an ideal value for the property. If possible, this value will be used, but if it's not possible, the user agent will use the closest possible match.",
        "type": "boolean"
      }
    },
    "patternProperties": {
      "^v_.*": {}
    },
    "additionalProperties": false
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/number.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/number.json",
    "type": "object",
    "description": "The number constraint is used to specify a constraint for a numerical property. (Inspired by https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#constraindouble)",
    "properties": {
      "max": {
        "description": "A number specifying the largest permissible value of the property it describes. If the value cannot remain equal to or less than this value, matching will fail.",
        "type": "number"
      },
      "min": {
        "description": "A number specifying the smallest permissible value of the property it describes. If the value cannot remain equal to or greater than this value, matching will fail.",
        "type": "number"
      },
      "exact": {
        "description": "A number specifying a specific, required, value the property must have to be considered acceptable.",
        "type": "number"
      },
      "ideal": {
        "description": "A number specifying an ideal value for the property. If possible, this value will be used, but if it's not possible, the user agent will use the closest possible match.",
        "type": "number"
      }
    },
    "patternProperties": {
      "^v_.*": {}
    },
    "additionalProperties": false
  },
  "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/string.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://ograf.ebu.io/v1/specification/json-schemas/lib/constraints/string.json",
    "type": "object",
    "description": "The string constraint is used to specify a constraint for a string property. (Inspired by https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#constraindomstring)",
    "properties": {
      "exact": {
        "description": "A string or an array of strings, one of which must be the value of the property. If the property can't be set to one of the listed values, matching will fail.",
        "type": "string"
      },
      "ideal": {
        "description": "A string (or an array of strings), specifying ideal values for the property. If possible, one of the listed values will be used, but if it's not possible, the user agent will use the closest possible match.",
        "oneOf": [
          {
            "type": "string"
          },
          {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        ]
      }
    },
    "patternProperties": {
      "^v_.*": {}
    },
    "additionalProperties": false
  }
} as const;

/** The graphics manifest schema itself. */
export const OGRAF_MANIFEST_SCHEMA = OGRAF_SCHEMAS[OGRAF_SCHEMA_ROOT_ID];
