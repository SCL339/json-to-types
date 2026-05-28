/**
 * json-to-types — JSON to TypeScript interface/type converter
 *
 * Converts a parsed JSON value into TypeScript type definitions.
 * Supports nested objects, arrays, union types, optional field detection.
 */

/**
 * @param {any} json - Parsed JSON value
 * @param {object} [opts]
 * @param {string} [opts.rootName='RootObject'] - Name for the root type
 * @param {boolean} [opts.useExport=true] - Whether to prefix with export
 * @param {boolean} [opts.detectOptional=true] - Auto-detect optional fields
 * @param {number} [opts.indentSize=2] - Spaces per indent
 * @param {boolean} [opts.dts=false] - Output as .d.ts style (unused, always uses interfaces)
 * @returns {string} TypeScript type definition string
 */
export function convert(json, opts = {}) {
  const {
    rootName = 'RootObject',
    useExport = true,
    detectOptional = true,
    indentSize = 2,
    dts = false,
  } = opts;

  const indent = ' '.repeat(indentSize);
  // Map from structural hash -> type name -> type info
  const structMap = new Map();
  const definedTypes = new Map();  // name -> typeInfo
  let counter = 0;

  function getJSType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  }

  function hashType(t) {
    if (!t || typeof t !== 'object') return String(t);
    if (t.kind === 'object') {
      const keys = Object.keys(t.fields || {}).sort();
      const parts = keys.map(k => `${k}:${hashType(t.fields[k])}`);
      return `{${parts.join(',')}}`;
    }
    if (t.kind === 'array') {
      return `[]${hashType(t.itemType)}`;
    }
    if (t.kind === 'union') {
      const parts = (t.types || []).map(hashType).sort();
      return `(${parts.join('|')})`;
    }
    return t.kind || 'any';
  }

  function getOrCreateTypeName(typeInfo) {
    if (typeInfo.kind !== 'object') return null;
    const h = hashType(typeInfo);
    if (structMap.has(h)) {
      return structMap.get(h);
    }
    counter++;
    const name = `${rootName}Sub${counter}`;
    structMap.set(h, name);
    typeInfo.typeName = name;
    definedTypes.set(name, typeInfo);
    return name;
  }

  function analyzeValue(val, seen) {
    const jsType = getJSType(val);

    if (val === null) return { kind: 'null' };
    if (jsType === 'string') return { kind: 'string' };
    if (jsType === 'number') return { kind: 'number' };
    if (jsType === 'boolean') return { kind: 'boolean' };

    if (jsType === 'array') {
      if (val.length === 0) return { kind: 'array', itemType: { kind: 'any' } };
      const itemTypes = val.map(item => analyzeValue(item, seen));
      const unique = deduplicateTypes(itemTypes);
      const itemType = unique.length === 1 ? unique[0] : { kind: 'union', types: unique };
      return { kind: 'array', itemType };
    }

    if (jsType === 'object') {
      const fields = {};
      for (const [key, value] of Object.entries(val)) {
        fields[key] = analyzeValue(value, seen);
      }
      const objType = { kind: 'object', fields };
      const name = getOrCreateTypeName(objType);
      return { kind: 'object', typeName: name, fields };
    }

    return { kind: 'any' };
  }

  function deduplicateTypes(arr) {
    const seen = new Set();
    const result = [];
    for (const t of arr) {
      const key = JSON.stringify(t);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(t);
      }
    }
    return result;
  }

  // Handle primitive/array root
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    const typeInfo = analyzeValue(json, new Set());
    const exp = useExport ? 'export ' : '';
    return `${exp}type ${rootName} = ${typeToStringInner(typeInfo)};\n`;
  }

  // Process root object
  const rootType = analyzeValue(json, new Set());
  rootType.typeName = rootName;
  definedTypes.set(rootName, rootType);
  // Remove the structural hash entry for root if it exists with a different name
  const rootHash = hashType(rootType);
  structMap.set(rootHash, rootName);

  // Collect defined type names in dependency order (topological sort)
  const orderedNames = [];
  const visited = new Set();

  function collect(name) {
    if (visited.has(name)) return;
    visited.add(name);
    const t = definedTypes.get(name);
    if (t && t.kind === 'object' && t.fields) {
      for (const [, fieldType] of Object.entries(t.fields)) {
        if (fieldType.kind === 'object' && fieldType.typeName) {
          collect(fieldType.typeName);
        } else if (fieldType.kind === 'array' && fieldType.itemType) {
          collectItemType(fieldType.itemType);
        }
      }
      orderedNames.push(name);
    }
  }

  function collectItemType(it) {
    if (!it) return;
    if (it.kind === 'object' && it.typeName) {
      collect(it.typeName);
    } else if (it.kind === 'union' && it.types) {
      for (const ut of it.types) collectItemType(ut);
    }
  }

  collect(rootName);

  let output = '';
  const exp = useExport ? 'export ' : '';

  for (const name of orderedNames) {
    if (name === rootName) continue;
    const t = definedTypes.get(name);
    output += renderType(name, t, indent, exp);
    output += '\n';
  }

  output += renderType(rootName, rootType, indent, exp);
  return output;
}

function renderType(name, typeInfo, indent, exp) {
  if (!typeInfo || typeInfo.kind !== 'object' || !typeInfo.fields) {
    return `${exp}type ${name} = Record<string, unknown>;\n`;
  }

  const entries = Object.entries(typeInfo.fields);
  let output = `${exp}interface ${name} {\n`;

  for (const [key, fieldType] of entries) {
    const { tsType, optional } = resolveFieldType(fieldType);
    const optMark = optional ? '?' : '';
    output += `${indent}${key}${optMark}: ${tsType};\n`;
  }

  output += `}\n`;
  return output;
}

function resolveFieldType(fieldType) {
  let optional = false;

  if (fieldType.kind === 'union' && Array.isArray(fieldType.types)) {
    const nonNull = fieldType.types.filter(t => t.kind !== 'null');
    if (nonNull.length < fieldType.types.length) {
      optional = true;
    }
    if (nonNull.length === 1) return { tsType: typeToStringInner(nonNull[0]), optional };
    if (nonNull.length === 0) return { tsType: 'null', optional: false };
    return { tsType: nonNull.map(t => typeToStringInner(t)).join(' | '), optional };
  }

  return { tsType: typeToStringInner(fieldType), optional };
}

function typeToStringInner(t) {
  if (!t) return 'unknown';
  switch (t.kind) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'null': return 'null';
    case 'any': return 'any';
    case 'array': {
      if (!t.itemType) return 'unknown[]';
      const inner = typeToStringInner(t.itemType);
      if (t.itemType.kind === 'union' && t.itemType.types && t.itemType.types.length > 1) {
        return `(${inner})[]`;
      }
      return `${inner}[]`;
    }
    case 'union':
      return t.types ? t.types.map(ti => typeToStringInner(ti)).join(' | ') : 'unknown';
    case 'object':
      return t.typeName || 'Record<string, unknown>';
    default:
      return 'unknown';
  }
}

/**
 * Convenience: parse JSON string and convert.
 */
export function convertString(jsonString, opts = {}) {
  const data = JSON.parse(jsonString);
  return convert(data, opts);
}
