# JSON to TypeScript Types

[![npm version](https://img.shields.io/npm/v/json-to-types.svg)](https://www.npmjs.com/package/json-to-types)
[![npm downloads](https://img.shields.io/npm/dm/json-to-types.svg)](https://www.npmjs.com/package/json-to-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/SCL339/json-to-types?style=social)](https://github.com/SCL339/json-to-types)

> **Convert JSON to TypeScript interfaces/types instantly.** A zero-config CLI tool that generates accurate TypeScript type definitions from JSON — supports nested objects, arrays, union types, optional field detection, and `.d.ts` export.

Stop writing TypeScript types by hand from JSON API responses, config files, or mock data. `json-to-types` does it in one command.

## Features

- ✨ **One command** — pipe JSON in, get TypeScript out
- 📦 **Nested objects** — auto-generates interface names for sub-objects
- 🔄 **Arrays** — detects homogeneous arrays, deduplicates object shapes
- 🎯 **Optional fields** — auto-detects nullable fields and marks them as optional (`?`)
- 📝 **`.d.ts` export** — output ready-to-use declaration files
- 🏷️ **Custom root name** — control the top-level type name
- 🧹 **No export** mode — for inline type definitions
- ⚡ **Zero config** — works out of the box, no TypeScript project required

## Installation

```bash
# Global install (recommended)
npm install -g json-to-types

# Or run via npx
npx json-to-types data.json

# Or use as a dependency
npm install --save-dev json-to-types
```

## Usage

### CLI

```bash
# From a JSON file
json-to-types data.json

# From stdin with custom root type name
cat data.json | json-to-types --name ApiResponse

# Output to file
json-to-types data.json --output types.ts

# Generate .d.ts declaration file
json-to-types data.json --dts --output types.d.ts

# Disable optional field detection
json-to-types data.json --no-optional

# Omit export keyword
json-to-types data.json --no-export

# Custom indentation
json-to-types data.json --indent 4
```

#### Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--name` | `-n` | `RootObject` | Root type name |
| `--output` | `-o` | stdout | Output file path |
| `--dts` | `-d` | `false` | Output as `.d.ts` |
| `--no-optional` | | `true` | Disable optional field detection |
| `--no-export` | | `true` | Omit `export` keyword |
| `--indent` | | `2` | Spaces per indent level |

### API (Programmatic Usage)

```ts
import { convert, convertString } from 'json-to-types';

// From a parsed object
const json = { name: 'John', age: 30, active: true };
const types = convert(json, { rootName: 'User' });
console.log(types);

// From a JSON string
const types2 = convertString('{"id":1,"title":"Hello"}', { rootName: 'Post' });
```

## Examples

### Basic Object

Input:
```json
{ "name": "Alice", "age": 25, "active": true }
```

Output:
```ts
export interface RootObject {
  name: string;
  age: number;
  active: boolean;
}
```

### Nested Object

Input:
```json
{
  "user": {
    "profile": {
      "bio": "Developer",
      "followers": 1200
    }
  }
}
```

Output:
```ts
export interface RootObjectSub1 {
  bio: string;
  followers: number;
}

export interface RootObjectSub2 {
  profile: RootObjectSub1;
}

export interface RootObject {
  user: RootObjectSub2;
}
```

### Arrays of Objects

Input:
```json
{
  "users": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ]
}
```

Output:
```ts
export interface RootObjectSub1 {
  id: number;
  name: string;
}

export interface RootObject {
  users: RootObjectSub1[];
}
```

### Optional Fields (nullable values)

Input:
```json
{ "name": "Test", "description": null }
```

Output:
```ts
export interface RootObject {
  name: string;
  description?: null;
}
```

## Use Cases

- **API response types** — get TypeScript types from any REST API JSON response
- **Configuration files** — generate types for JSON configs (`.eslintrc`, `tsconfig`, etc.)
- **Mock data** — turn mock JSON objects into proper TypeScript interfaces
- **Legacy migration** — quickly type existing JSON blobs in a TypeScript codebase
- **Documentation** — generate type stubs for API documentation

## Why json-to-types?

| Feature | json-to-types | Other tools |
|---------|--------------|-------------|
| Nested type names | ✅ Automatic | ❌ Often missing |
| Array item dedup | ✅ Structural hash | ❌ Duplicate types |
| Optional detection | ✅ Auto from null | ❌ Manual only |
| .d.ts output | ✅ Built-in | ⚠️ Partial |
| Zero dependencies | ✅ (only commander) | ❌ Heavy |
| CLI + API | ✅ Both | ⚠️ Usually one |

## Related

- [git-branch-cleaner](https://github.com/SCL339/git-branch-cleaner) — Interactive CLI to clean up stale Git branches
- [env-validator](https://github.com/SCL339/env-validator) — Validate .env files against .env.example

## License

MIT © [SCL339](https://github.com/SCL339)
