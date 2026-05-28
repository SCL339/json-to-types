#!/usr/bin/env node

import { program } from 'commander';
import { readFileSync, writeFileSync } from 'node:fs';
import { convert } from '../lib/converter.js';

program
  .name('json-to-types')
  .description('Convert JSON to TypeScript interfaces/types')
  .version('1.0.0')
  .argument('[file]', 'JSON file to convert (omit to read from stdin)')
  .option('-n, --name <name>', 'Root type name', 'RootObject')
  .option('-o, --output <file>', 'Output file (omit to print to stdout)')
  .option('-d, --dts', 'Output as .d.ts declaration file')
  .option('--no-optional', 'Disable optional field detection')
  .option('--no-export', 'Omit export keyword from types')
  .option('--indent <size>', 'Indentation size', '2')
  .action((file, options) => {
    try {
      let input;
      if (file) {
        input = readFileSync(file, 'utf-8');
      } else {
        input = readFileSync(0, 'utf-8');
      }

      const jsonData = JSON.parse(input);

      const result = convert(jsonData, {
        rootName: options.name,
        useExport: options.export,
        detectOptional: options.optional,
        indentSize: parseInt(options.indent, 10),
        dts: options.dts,
      });

      if (options.output) {
        writeFileSync(options.output, result, 'utf-8');
        console.error(`✓ Written to ${options.output}`);
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  });

program.parse();
