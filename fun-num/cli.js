#!/usr/bin/env node

const { generateFunNumbers } = require('./fun-numbers.js');

function printHelp() {
  console.log(`
🎯 Fun Numbers Generator CLI

Usage: node cli.js <number> [number2] [number3] ...
   or: ./cli.js <number> [options]

Options:
  --count <n>      Show top N results (default: 3)
  --all           Show all results (up to 15)
  -h, --help      Show this help

Examples:
  node cli.js 1200                    # Generate top 3 fun numbers for 1200
  node cli.js 1200 4000 500           # Generate for multiple numbers
  node cli.js 1200 --count 5          # Show top 5 results
  node cli.js 1200 --all              # Show all results

This tool generates fun/nice numbers closest to your input:
• Repeating digits (4444, 5555)
• Alternating patterns (1212, 1313)
• Palindromes (1221, 1331)
• Repeated endings (1222, 1333)
• Sequential numbers (1234, 5678)
• Round numbers (1000, 5000)
`);
}

function formatResults(input, results, count = 3) {
  console.log(`\n🎯 Fun numbers for ${input.toLocaleString()}:`);
  console.log('═'.repeat(50));

  if (results.length === 0) {
    console.log('   No fun numbers found!');
    return;
  }

  const displayResults = results.slice(0, count);

  displayResults.forEach((result, index) => {
    const diff = result.value - input;
    const percentage = ((diff / input) * 100).toFixed(1);
    const arrow = diff === 0 ? '→' : '↗';

    const funEmoji = result.funRating >= 120 ? '🔥' : result.funRating >= 100 ? '⭐' : result.funRating >= 80 ? '✨' : '💫';
    console.log(`${(index + 1).toString().padStart(2)}. ${result.value.toLocaleString()} ${arrow} +${diff.toLocaleString()} (+${percentage}%) ${funEmoji}`);
    console.log(`    ${result.type} • ${result.pattern} • fun: ${result.funRating}`);
  });

  const totalFound = results.length;
  if (count < totalFound) {
    console.log(`\n💡 Showing top ${count} of ${totalFound} results (use --all to see more)`);
  } else {
    console.log(`\n💡 Found ${totalFound} fun numbers!`);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    return;
  }

  // Parse arguments
  const numbers = [];
  let count = 3;
  let showAll = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--count') {
      count = parseInt(args[i + 1]);
      if (isNaN(count) || count <= 0) {
        console.error('❌ Error: --count must be a positive number');
        process.exit(1);
      }
      i++; // Skip next argument since it's the count value
    } else if (arg === '--all') {
      showAll = true;
    } else if (!arg.startsWith('--')) {
      const num = parseInt(arg);
      if (isNaN(num) || num <= 0) {
        console.error(`❌ Error: "${arg}" is not a valid positive number`);
        process.exit(1);
      }
      numbers.push(num);
    }
  }

  if (numbers.length === 0) {
    console.error('❌ Error: Please provide at least one positive number');
    console.error('Example: node cli.js 1200');
    process.exit(1);
  }

  if (showAll) {
    count = 15;
  }

  console.log('🚀 Generating fun numbers...');

  try {
    numbers.forEach((input, index) => {
      const results = generateFunNumbers(input);
      formatResults(input, results, count);

      // Add separator between multiple results (except for the last one)
      if (index < numbers.length - 1) {
        console.log('\n' + '─'.repeat(50));
      }
    });
  } catch (error) {
    console.error('❌ Error generating fun numbers:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, formatResults };