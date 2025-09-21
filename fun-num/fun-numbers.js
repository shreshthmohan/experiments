function calculateFunRating(num, type, input) {
  const str = num.toString();
  let rating = 0;

  // Base ratings by type (higher = more fun)
  const typeRatings = {
    'repeated': 100,           // 4444, 5555 - most fun
    'palindrome': 90,          // 1221, 1331 - very fun
    'repeated-ending': 70,     // 1222, 1333 - pretty fun
    'ascending': 80,           // 1234, 5678 - quite fun
    'descending': 80,          // 4321, 9876 - quite fun
    'alternating': 60,         // 1212, 1313 - moderately fun
    'round': 30,               // 5000, 10000 - least fun
  };

  rating = typeRatings[type] || 50;

  // Bonus for special patterns
  if (type === 'palindrome') {
    // Extra points for palindromes with repeated digits (like 1441, 1221)
    const uniqueDigits = new Set(str).size;
    if (uniqueDigits <= 2) {
      rating += 20; // 1441, 1221 get bonus
    }
    if (uniqueDigits === 1) {
      rating += 10; // 1111, 2222 get extra bonus
    }
  }

  if (type === 'repeated') {
    // Longer repeated patterns are more fun
    rating += str.length * 5;

    // Special digits get bonus
    if (str[0] === '7' || str[0] === '8' || str[0] === '9') {
      rating += 10; // 777, 888, 999 are extra fun
    }
  }

  if (type === 'ascending' || type === 'descending') {
    // Longer sequences are more fun
    rating += str.length * 3;

    // Perfect sequences get bonus
    if (str.length >= 5) {
      rating += 15;
    }
  }

  if (type === 'alternating') {
    // Penalize boring alternating patterns
    if (str.includes('0')) {
      rating -= 15; // 1010, 2020 are less fun
    }

    // Bonus for interesting digit combinations
    const first = parseInt(str[0]);
    const second = parseInt(str[1]);
    if (Math.abs(first - second) === 1) {
      rating += 10; // 1212, 2323 (consecutive digits)
    }
  }

  // Proximity bonus (closer to input = slight bonus, but not primary factor)
  const diff = num - input;
  const proximityBonus = Math.max(0, 10 - Math.floor(diff / input * 50));
  rating += proximityBonus;

  // Same digit bonus (if the number uses the same leading digit as input)
  const inputLeadingDigit = input.toString()[0];
  if (str[0] === inputLeadingDigit && type === 'repeated') {
    rating += 25; // Strong bonus for same digit repeated patterns (4000 → 4444)
  } else if (str.includes(inputLeadingDigit)) {
    rating += 5; // Small bonus for including the input's leading digit
  }

  // Special number bonuses
  if (str === '1337') rating += 25; // Leet speak
  if (str === '2222' || str === '3333' || str === '6666' || str === '7777' || str === '8888' || str === '9999') {
    rating += 15; // Quad repeats are special
  }

  return rating;
}

function isInherentlyFun(num) {
  const str = num.toString();

  // Check if it's a palindrome
  if (str === str.split('').reverse().join('')) return true;

  // Check if it's repeated digits (like 111, 4444)
  if (str.split('').every(digit => digit === str[0]) && str[0] !== '0') return true;

  // Check if it's alternating pattern (like 1212, 1313)
  if (str.length >= 4) {
    const first = str[0];
    const second = str[1];
    let isAlternating = true;
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== (i % 2 === 0 ? first : second)) {
        isAlternating = false;
        break;
      }
    }
    if (isAlternating && first !== second) return true;
  }

  // Check if it's ascending sequence (like 1234, 5678)
  if (str.length >= 3) {
    let isAscending = true;
    for (let i = 1; i < str.length; i++) {
      if (parseInt(str[i]) !== parseInt(str[i-1]) + 1) {
        isAscending = false;
        break;
      }
    }
    if (isAscending) return true;
  }

  // Check if it's descending sequence (like 4321, 9876)
  if (str.length >= 3) {
    let isDescending = true;
    for (let i = 1; i < str.length; i++) {
      if (parseInt(str[i]) !== parseInt(str[i-1]) - 1) {
        isDescending = false;
        break;
      }
    }
    if (isDescending) return true;
  }

  return false;
}

function generateFunNumbers(input) {
  const results = [];
  const inputStr = input.toString();
  const inputLength = inputStr.length;

  // Generate repeating digit patterns (like 4444, 5555)
  for (let digit = 1; digit <= 9; digit++) {
    for (let length = inputLength; length <= inputLength + 2; length++) {
      const repeated = digit.toString().repeat(length);
      const num = parseInt(repeated);
      if (num >= input) {
        const result = { value: num, type: 'repeated', pattern: `${digit} repeated ${length} times` };
        result.funRating = calculateFunRating(num, 'repeated', input);
        results.push(result);
      }
    }
  }

  // Generate alternating patterns (like 1212, 1313)
  for (let first = 1; first <= 9; first++) {
    for (let second = 0; second <= 9; second++) {
      if (first !== second) {
        for (let pairs = Math.ceil(inputLength / 2); pairs <= Math.ceil(inputLength / 2) + 1; pairs++) {
          let pattern = '';
          for (let i = 0; i < pairs; i++) {
            pattern += first.toString() + second.toString();
          }
          // Try both full pattern and truncated versions
          for (let len = inputLength; len <= pattern.length; len++) {
            const truncated = pattern.substring(0, len);
            const num = parseInt(truncated);
            if (num >= input && truncated.length >= inputLength) {
              const result = { value: num, type: 'alternating', pattern: `${first}${second} alternating` };
              result.funRating = calculateFunRating(num, 'alternating', input);
              results.push(result);
            }
          }
        }
      }
    }
  }

  // Generate patterns with repeated endings (like 1222, 1333)
  for (let first = 1; first <= 9; first++) {
    for (let repeated = 1; repeated <= 9; repeated++) { // Skip 0 to avoid boring patterns like 1000
      if (first !== repeated) {
        for (let length = inputLength; length <= inputLength + 1; length++) {
          if (length >= 2) {
            const pattern = first.toString() + repeated.toString().repeat(length - 1);
            const num = parseInt(pattern);
            if (num >= input) {
              const result = { value: num, type: 'repeated-ending', pattern: `${first} + ${repeated} repeated` };
              result.funRating = calculateFunRating(num, 'repeated-ending', input);
              results.push(result);
            }
          }
        }
      }
    }
  }

  // Generate palindromes
  function generatePalindromes(length) {
    const palindromes = [];
    const halfLength = Math.ceil(length / 2);

    const start = Math.pow(10, halfLength - 1);
    const end = Math.pow(10, halfLength) - 1;

    for (let i = start; i <= end; i++) {
      const leftHalf = i.toString();
      const rightHalf = leftHalf.split('').reverse().join('');

      let palindrome;
      if (length % 2 === 0) {
        palindrome = leftHalf + rightHalf;
      } else {
        palindrome = leftHalf + rightHalf.substring(1);
      }

      const num = parseInt(palindrome);
      if (num >= input) {
        const result = { value: num, type: 'palindrome', pattern: 'palindrome' };
        result.funRating = calculateFunRating(num, 'palindrome', input);
        palindromes.push(result);
      }
    }
    return palindromes;
  }

  // Generate palindromes for current length and one longer
  results.push(...generatePalindromes(inputLength));
  results.push(...generatePalindromes(inputLength + 1));

  // Generate ascending sequences (like 1234, 2345)
  for (let start = 1; start <= 9; start++) {
    for (let length = inputLength; length <= inputLength + 1; length++) {
      if (start + length - 1 <= 9) {
        let sequence = '';
        for (let i = 0; i < length; i++) {
          sequence += (start + i).toString();
        }
        const num = parseInt(sequence);
        if (num >= input) {
          const result = { value: num, type: 'ascending', pattern: 'ascending sequence' };
          result.funRating = calculateFunRating(num, 'ascending', input);
          results.push(result);
        }
      }
    }
  }

  // Generate descending sequences (like 9876, 8765)
  for (let start = 9; start >= 1; start--) {
    for (let length = inputLength; length <= inputLength + 1; length++) {
      if (start - length + 1 >= 0) {
        let sequence = '';
        for (let i = 0; i < length; i++) {
          sequence += (start - i).toString();
        }
        const num = parseInt(sequence);
        if (num >= input) {
          const result = { value: num, type: 'descending', pattern: 'descending sequence' };
          result.funRating = calculateFunRating(num, 'descending', input);
          results.push(result);
        }
      }
    }
  }

  // Generate round numbers (like 5000, 10000)
  const orderOfMagnitude = Math.pow(10, inputLength - 1);
  for (let multiplier = 1; multiplier <= 10; multiplier++) {
    const roundNum = multiplier * orderOfMagnitude;
    if (roundNum >= input) {
      const result = { value: roundNum, type: 'round', pattern: 'round number' };
      result.funRating = calculateFunRating(roundNum, 'round', input);
      results.push(result);
    }
  }

  // Add next order of magnitude
  const nextOrder = Math.pow(10, inputLength);
  if (nextOrder >= input) {
    const result = { value: nextOrder, type: 'round', pattern: 'power of 10' };
    result.funRating = calculateFunRating(nextOrder, 'round', input);
    results.push(result);
  }

  // Remove duplicates and sort by value
  const unique = results.filter((item, index, arr) =>
    arr.findIndex(other => other.value === item.value) === index
  );

  // Filter out the input number unless it's inherently fun
  // Also filter out numbers more than 30% away from input
  const filtered = unique.filter(item => {
    // Don't include input unless it's inherently fun
    if (item.value === input && !isInherentlyFun(input)) return false;

    // Filter out numbers more than 30% away from input
    const percentageDiff = Math.abs((item.value - input) / input) * 100;
    return percentageDiff <= 30;
  });

  // Sort by fun rating (highest first), then by proximity as tiebreaker
  return filtered.sort((a, b) => {
    if (b.funRating !== a.funRating) {
      return b.funRating - a.funRating; // Higher fun rating first
    }
    return a.value - b.value; // Closer to input as tiebreaker
  }).slice(0, 15); // Return top 15 most fun
}

module.exports = { generateFunNumbers };