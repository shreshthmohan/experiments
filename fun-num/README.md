# Fun Numbers Generator 🎯

A JavaScript utility that generates fun/nice numbers closest to your input value. Perfect for finding aesthetically pleasing numbers that are slightly larger than your target.

## Features

- **Repeating digits**: 4444, 5555, 7777
- **Alternating patterns**: 1212, 1313, 2424
- **Palindromes**: 1221, 1331, 4554
- **Repeated endings**: 1222, 1333, 2666
- **Sequential numbers**: 1234, 2345, 5678
- **Round numbers**: 1000, 5000, 10000

## Installation

```bash
# Clone or download the files
# No dependencies required - pure JavaScript!
```

## Usage

### Command Line Interface

```bash
# Basic usage (shows top 3 results)
node cli.js 1200

# Multiple numbers
node cli.js 1200 4000 500

# Custom result count
node cli.js 1200 --count 5

# Show all results
node cli.js 1200 --all

# Make executable and use directly
chmod +x cli.js
./cli.js 4000

# Get help
node cli.js --help
```

### Examples

```bash
# Single number (default: top 3)
$ node cli.js 1200
🎯 Fun numbers for 1,200:
 1. 1,212 ↗ +12 (+1.0%) - alternating • 12 alternating
 2. 1,221 ↗ +21 (+1.8%) - palindrome • palindrome
 3. 1,222 ↗ +22 (+1.8%) - repeated-ending • 1 + 2 repeated
💡 Showing top 3 of 15 results (use --all to see more)

# Multiple numbers
$ node cli.js 1200 4000
🎯 Fun numbers for 1,200:
 1. 1,212 ↗ +12 (+1.0%) - alternating • 12 alternating
 2. 1,221 ↗ +21 (+1.8%) - palindrome • palindrome
 3. 1,222 ↗ +22 (+1.8%) - repeated-ending • 1 + 2 repeated
──────────────────────────────────────────────────
🎯 Fun numbers for 4,000:
 1. 4,000 → +0 (+0.0%) - repeated-ending • 4 + 0 repeated
 2. 4,004 ↗ +4 (+0.1%) - palindrome • palindrome
 3. 4,040 ↗ +40 (+1.0%) - alternating • 40 alternating

# Show more results
$ node cli.js 1200 --count 5
# Shows top 5 results instead of 3
```

### As a Module

```javascript
const { generateFunNumbers } = require('./fun-numbers.js');

const results = generateFunNumbers(1200);
console.log(results);
// [
//   { value: 1212, type: 'alternating', pattern: '12 alternating' },
//   { value: 1221, type: 'palindrome', pattern: 'palindrome' },
//   { value: 1222, type: 'repeated-ending', pattern: '1 + 2 repeated' }
//   ...
// ]
```

## Testing

```bash
npm test
# or
node test.js
```

## Test Results

The utility has been tested with various inputs:

- **2500** → 2525, 2552, 2555...
- **1250** → 1313, 1331, 1333...
- **1000** → 1000, 1001, 1010, 1111, 1212, 1221, 1222...
- **500** → 500, 505, 515, 525, 555...
- **4000** → 4000, 4004, 4040, 4444...

## Algorithm

The generator creates various pattern types:

1. **Repeated digits**: Same digit repeated (1111, 2222)
2. **Alternating patterns**: Two digits alternating (1212, 1313)
3. **Palindromes**: Numbers that read the same forwards and backwards
4. **Repeated endings**: One digit followed by repeated digits (1222, 1333)
5. **Sequential**: Ascending (1234) or descending (4321) sequences
6. **Round numbers**: Powers of 10 and their multiples

Results are sorted by proximity to the input and limited to the 15 closest matches.