1|     1|     1|# JSON to TypeScript Types
     2|     2|     2|
     3|     3|     3|[![npm version](https://img.shields.io/npm/v/json-to-types.svg)](https://www.npmjs.com/package/json-to-types)
     4|     4|     4|[![npm downloads](https://img.shields.io/npm/dm/json-to-types.svg)](https://www.npmjs.com/package/json-to-types)
     5|     5|     5|[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
     6|     6|     6|[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)
     7|     7|     7|[![GitHub stars](https://img.shields.io/github/stars/SCL339/json-to-types?style=social)](https://github.com/SCL339/json-to-types)
     8|     8|     8|
     9|     9|     9|---
    10|    10|    10|
    11|    11|    11|
    12|    12|    12|- 🎯 **Optional fields** — auto-detects nullable fields and marks them as optional (`?`)
    13|    13|    13|- 📝 **`.d.ts` export** — output ready-to-use declaration files
    14|    14|    14|- 🏷️ **Custom root name** — control the top-level type name
    15|    15|    15|- 🧹 **No export** mode — for inline type definitions
    16|    16|    16|- ⚡ **Zero config** — works out of the box, no TypeScript project required
    17|    17|    17|
    18|    18|    18|---
    19|    19|    19|
    20|    20|    20|
    21|    21|    21|# Global install (recommended)
    22|    22|    22|npm install -g json-to-types
    23|    23|    23|
    24|    24|    24|# Or run via npx
    25|    25|    25|npx json-to-types data.json
    26|    26|    26|
    27|    27|    27|# Or use as a dependency
    28|    28|    28|npm install --save-dev json-to-types
    29|    29|    29|```
    30|    30|    30|
    31|    31|    31|---
    32|    32|    32|
    33|    33|    33|
    34|    34|    34|# From a JSON file
    35|    35|    35|json-to-types data.json
    36|    36|    36|
    37|    37|    37|# From stdin with custom root type name
    38|    38|    38|cat data.json | json-to-types --name ApiResponse
    39|    39|    39|
    40|    40|    40|# Output to file
    41|    41|    41|json-to-types data.json --output types.ts
    42|    42|    42|
    43|    43|    43|# Generate .d.ts declaration file
    44|    44|    44|json-to-types data.json --dts --output types.d.ts
    45|    45|    45|
    46|    46|    46|# Disable optional field detection
    47|    47|    47|json-to-types data.json --no-optional
    48|    48|    48|
    49|    49|    49|# Omit export keyword
    50|    50|    50|json-to-types data.json --no-export
    51|    51|    51|
    52|    52|    52|# Custom indentation
    53|    53|    53|json-to-types data.json --indent 4
    54|    54|    54|```
    55|    55|    55|
    56|    56|    56|---
    57|    57|    57|
    58|    58|    58|
    59|    59|    59||--------|-------|---------|-------------|
    60|    60|    60|| `--name` | `-n` | `RootObject` | Root type name |
    61|    61|    61|| `--output` | `-o` | stdout | Output file path |
    62|    62|    62|| `--dts` | `-d` | `false` | Output as `.d.ts` |
    63|    63|    63|| `--no-optional` | | `true` | Disable optional field detection |
    64|    64|    64|| `--no-export` | | `true` | Omit `export` keyword |
    65|    65|    65|| `--indent` | | `2` | Spaces per indent level |
    66|    66|    66|
    67|    67|    67|---
    68|    68|    68|
    69|    69|    69|
    70|    70|    70|import { convert, convertString } from 'json-to-types';
    71|    71|    71|
    72|    72|    72|// From a parsed object
    73|    73|    73|const json = { name: 'John', age: 30, active: true };
    74|    74|    74|const types = convert(json, { rootName: 'User' });
    75|    75|    75|console.log(types);
    76|    76|    76|
    77|    77|    77|// From a JSON string
    78|    78|    78|const types2 = convertString('{"id":1,"title":"Hello"}', { rootName: 'Post' });
    79|    79|    79|```
    80|    80|    80|
    81|    81|    81|---
    82|    82|    82|
    83|    83|    83|
    84|    84|    84|```json
    85|    85|    85|{ "name": "Alice", "age": 25, "active": true }
    86|    86|    86|```
    87|    87|    87|
    88|    88|    88|Output:
    89|    89|    89|```ts
    90|    90|    90|export interface RootObject {
    91|    91|    91|  name: string;
    92|    92|    92|  age: number;
    93|    93|    93|  active: boolean;
    94|    94|    94|}
    95|    95|    95|```
    96|    96|    96|
    97|    97|    97|---
    98|    98|    98|
    99|    99|    99|
   100|   100|   100|```json
   101|   101|   101|{
   102|   102|   102|  "user": {
   103|   103|   103|    "profile": {
   104|   104|   104|      "bio": "Developer",
   105|   105|   105|      "followers": 1200
   106|   106|   106|    }
   107|   107|   107|  }
   108|   108|   108|}
   109|   109|   109|```
   110|   110|   110|
   111|   111|   111|Output:
   112|   112|   112|```ts
   113|   113|   113|export interface RootObjectSub1 {
   114|   114|   114|  bio: string;
   115|   115|   115|  followers: number;
   116|   116|   116|}
   117|   117|   117|
   118|   118|   118|export interface RootObjectSub2 {
   119|   119|   119|  profile: RootObjectSub1;
   120|   120|   120|}
   121|   121|   121|
   122|   122|   122|export interface RootObject {
   123|   123|   123|  user: RootObjectSub2;
   124|   124|   124|}
   125|   125|   125|```
   126|   126|   126|
   127|   127|   127|---
   128|   128|   128|
   129|   129|   129|
   130|   130|   130|```json
   131|   131|   131|{
   132|   132|   132|  "users": [
   133|   133|   133|    { "id": 1, "name": "Alice" },
   134|   134|   134|    { "id": 2, "name": "Bob" }
   135|   135|   135|  ]
   136|   136|   136|}
   137|   137|   137|```
   138|   138|   138|
   139|   139|   139|Output:
   140|   140|   140|```ts
   141|   141|   141|export interface RootObjectSub1 {
   142|   142|   142|  id: number;
   143|   143|   143|  name: string;
   144|   144|   144|}
   145|   145|   145|
   146|   146|   146|export interface RootObject {
   147|   147|   147|  users: RootObjectSub1[];
   148|   148|   148|}
   149|   149|   149|```
   150|   150|   150|
   151|   151|   151|---
   152|   152|   152|
   153|   153|   153|
   154|   154|   154|```json
   155|   155|   155|{ "name": "Test", "description": null }
   156|   156|   156|```
   157|   157|   157|
   158|   158|   158|Output:
   159|   159|   159|```ts
   160|   160|   160|export interface RootObject {
   161|   161|   161|  name: string;
   162|   162|   162|  description?: null;
   163|   163|   163|}
   164|   164|   164|```
   165|   165|   165|
   166|   166|   166|---
   167|   167|   167|
   168|   168|   168|
   169|   169|   169|- **Configuration files** — generate types for JSON configs (`.eslintrc`, `tsconfig`, etc.)
   170|   170|   170|- **Mock data** — turn mock JSON objects into proper TypeScript interfaces
   171|   171|   171|- **Legacy migration** — quickly type existing JSON blobs in a TypeScript codebase
   172|   172|   172|- **Documentation** — generate type stubs for API documentation
   173|   173|   173|
   174|   174|   174|---
   175|   175|   175|
   176|   176|   176|
   177|   177|   177||---------|--------------|-------------|
   178|   178|   178|| Nested type names | ✅ Automatic | ❌ Often missing |
   179|   179|   179|| Array item dedup | ✅ Structural hash | ❌ Duplicate types |
   180|   180|   180|| Optional detection | ✅ Auto from null | ❌ Manual only |
   181|   181|   181|| .d.ts output | ✅ Built-in | ⚠️ Partial |
   182|   182|   182|| Zero dependencies | ✅ (only commander) | ❌ Heavy |
   183|   183|   183|| CLI + API | ✅ Both | ⚠️ Usually one |
   184|   184|   184|
   185|   185|   185|---
   186|   186|   186|
   187|   187|   187|
   188|   188|   188|- [env-validator](https://github.com/SCL339/env-validator) — Validate .env files against .env.example
   189|   189|   189|
   190|   190|   190|---
   191|   191|   191|
   192|   192|   192|ARKER
   193|   193|   193|- 🚀 **Deploy your frontend** on [Vercel](https://vercel.com/?utm_source=scl339&utm_campaign=oss)
   194|   194|   194|- ⭐ **Star this repo** to help others discover it
   195|   195|   195|
   196|   196|   196|
   197|   197|   197|---
   198|   198|   198|
   199|   199|   199|
   200|   200|   200|

---

## 🤝 赞助支持 (Sponsor)

如果这个项目对你有帮助，可以请我喝杯咖啡 ☕

- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目

## 📄 License
