# JSON to TypeScript Types

[![npm version](https://img.shields.io/npm/v/json-to-types.svg)](https://www.npmjs.com/package/json-to-types)
[![npm downloads](https://img.shields.io/npm/dm/json-to-types.svg)](https://www.npmjs.com/package/json-to-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/SCL339/json-to-types?style=social)](https://github.com/SCL339/json-to-types)

---

- 🎯 **Optional fields** — auto-detects nullable fields and marks them as optional (`?`)
- 📝 **`.d.ts` export** — output ready-to-use declaration files
- 🏷️ **Custom root name** — control the top-level type name
- 🧹 **No export** mode — for inline type definitions
- ⚡ **Zero config** — works out of the box, no TypeScript project required

---

# Global install (recommended)
npm install -g json-to-types

# Or run via npx
npx json-to-types data.json

# Or use as a dependency
npm install --save-dev json-to-types
```

---

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

---

|--------|-------|---------|-------------|
| `--name` | `-n` | `RootObject` | Root type name |
| `--output` | `-o` | stdout | Output file path |
| `--dts` | `-d` | `false` | Output as `.d.ts` |
| `--no-optional` | | `true` | Disable optional field detection |
| `--no-export` | | `true` | Omit `export` keyword |
| `--indent` | | `2` | Spaces per indent level |

---

import { convert, convertString } from 'json-to-types';

// From a parsed object
const json = { name: 'John', age: 30, active: true };
const types = convert(json, { rootName: 'User' });
console.log(types);

// From a JSON string
const types2 = convertString('{"id":1,"title":"Hello"}', { rootName: 'Post' });
```

---

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

---

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

---

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

---

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

---

- **Configuration files** — generate types for JSON configs (`.eslintrc`, `tsconfig`, etc.)
- **Mock data** — turn mock JSON objects into proper TypeScript interfaces
- **Legacy migration** — quickly type existing JSON blobs in a TypeScript codebase
- **Documentation** — generate type stubs for API documentation

---

|---------|--------------|-------------|
| Nested type names | ✅ Automatic | ❌ Often missing |
| Array item dedup | ✅ Structural hash | ❌ Duplicate types |
| Optional detection | ✅ Auto from null | ❌ Manual only |
| .d.ts output | ✅ Built-in | ⚠️ Partial |
| Zero dependencies | ✅ (only commander) | ❌ Heavy |
| CLI + API | ✅ Both | ⚠️ Usually one |

---

- [env-validator](https://github.com/SCL339/env-validator) — Validate .env files against .env.example

---

- 🚀 **Deploy your frontend** on [Vercel](https://vercel.com/?utm_source=scl339&utm_campaign=oss)
- ⭐ **Star this repo** to help others discover it

---

---

## 🤝 赞助支持 (Sponsor)

如果这个项目对你有帮助，可以请我喝杯咖啡 ☕

- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目

## 📄 License