# Sum to N Methods

This document compares three methods for computing the sum of the first `n` integers.

---

## Method 1: Using a Loop (Iterative Approach)

```typescript
function sum_to_n_a(n: number): number {
  let sum = 0; // Initialize the sum variable to store the result
  for (let i = 1; i <= n; i++) {
    // Iterate from 1 to n
    sum += i; // Add the current value of i to the sum
  }
  return sum; // Return the computed sum
}
```

### Explanation:
- **Time complexity:** `O(n)` - The loop iterates `n` times.
- **Space complexity:** `O(1)` - Uses a constant amount of memory.

---

## Method 2: Using a Mathematical Formula

```typescript
function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2; // Calculate the sum using the formula for the sum of the first n integers
}
```

### Explanation:
- **Time complexity:** `O(1)` - The formula computes the sum in constant time.
- **Space complexity:** `O(1)` - No additional memory is used beyond the return value.

---

## Method 3: Using Recursion (Recursive Approach)

```typescript
function sum_to_n_c(n: number): number {
  if (n === 1) return 1; // Base case: the sum of the first integer is the integer itself
  return n + sum_to_n_c(n - 1); // Recursive step: add n to the sum of integers up to (n-1)
}
```

### Explanation:
- **Time complexity:** `O(n)` - There are `n` recursive calls.
- **Space complexity:** `O(n)` - Each recursive call adds a new frame to the call stack.

---

## Which Method is Best?

- **Use Mathematical Formula (Method 2):** Whenever performance and efficiency are critical. It's the fastest and most resource-efficient approach.
- **Use Iterative Method (Method 1):** If simplicity is a priority and you want to avoid potential issues with floating-point precision.
- **Use Recursive Method (Method 3):** For academic purposes or small values of `n`. Avoid for large inputs due to the risk of stack overflow.

### Special Considerations:
- If `n` is very large, both the Iterative and Recursive methods may struggle, making the Formula method the clear choice.
