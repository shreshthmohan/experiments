const { generateFunNumbers } = require('./fun-numbers.js');

function runTests() {
  console.log('🧪 Testing Fun Numbers Generator\n');

  const testCases = [2500, 1250, 1000, 500, 4000, 1200, 123, 99, 777, 3456];

  testCases.forEach(input => {
    console.log(`\n📊 Input: ${input}`);
    console.log('═'.repeat(50));

    const results = generateFunNumbers(input);

    results.forEach((result, index) => {
      const diff = result.value - input;
      const percentage = ((diff / input) * 100).toFixed(1);
      console.log(`${index + 1}. ${result.value} (${result.type}) - +${diff} (+${percentage}%)`);
      console.log(`   Pattern: ${result.pattern}`);
    });

    if (results.length === 0) {
      console.log('   No fun numbers found!');
    }
  });

  // Specific test cases mentioned in requirements
  console.log('\n🎯 Specific Test Cases:');
  console.log('═'.repeat(50));

  console.log('\nTesting 4000 → should include 4444:');
  const test4000 = generateFunNumbers(4000);
  const has4444 = test4000.some(r => r.value === 4444);
  console.log(`✓ Contains 4444: ${has4444}`);
  if (has4444) {
    const found4444 = test4000.find(r => r.value === 4444);
    console.log(`   Found: ${found4444.value} (${found4444.type})`);
  }

  console.log('\nTesting 1200 → should include 1212, 1222, palindromes:');
  const test1200 = generateFunNumbers(1200);
  const has1212 = test1200.some(r => r.value === 1212);
  const has1222 = test1200.some(r => r.value === 1222);
  const has1221 = test1200.some(r => r.value === 1221);
  console.log(`✓ Contains 1212: ${has1212}`);
  console.log(`✓ Contains 1222: ${has1222}`);
  console.log(`✓ Contains 1221 (palindrome): ${has1221}`);

  console.log('\n✅ Test completed!');
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };