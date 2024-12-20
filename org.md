# JavaScript Module Organization Guide

## Project Structure
```
project/
├── shared/
│   ├── alert.js        # Shared functionality
│   └── utils.js        # Common utilities
├── module1/
│   └── index.js        # Module-specific code
├── module2/
│   └── index.js        # Another module
└── index.js            # Main entry point
```

## Shared Module Example
In `shared/alert.js`:
```javascript
// Export a function or class
export const createAlertHandler = () => {
  // Implementation
  return {
    showAlert: () => {},
    hideAlert: () => {}
  };
};

// Or default export
export default createAlertHandler;
```

## Using Shared Modules
In `module1/index.js`:
```javascript
// Named import
import { createAlertHandler } from '../shared/alert.js';

// Or default import
import createAlertHandler from '../shared/alert.js';

const initialize = () => {
  const alertHandler = createAlertHandler();
  // Module implementation
};

export default initialize;
```

## Main Entry Point
In `index.js`:
```javascript
// Export everything needed
export { default as module1 } from './module1/index.js';
export { default as module2 } from './module2/index.js';
export { createAlertHandler } from './shared/alert.js';
```

## Key Concepts
1. **Module Organization**
   - Keep shared code in a separate directory
   - Each module should be self-contained
   - Use clear, descriptive file names
   - Group related functionality together

2. **Import/Export Patterns**
   - Use ES6 modules with `import`/`export`
   - Can use both named and default exports
   - Use relative paths for imports
   - Main entry point exports everything needed

3. **Best Practices**
   - Keep modules focused and single-purpose
   - Document public APIs and interfaces
   - Use consistent naming conventions
   - Consider bundling for production

4. **Implementation Tips**
   - Test modules in isolation
   - Handle errors gracefully
   - Use TypeScript for better type safety
   - Consider lazy loading for larger modules

## Usage Example
```javascript
// In your application
import { module1, createAlertHandler } from './index.js';

// Initialize specific module
module1();

// Use shared functionality
const alertHandler = createAlertHandler();
``` 