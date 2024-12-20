Here's the plain text version suitable for AI agent instructions:

JAVASCRIPT MODULE DELIVERY INSTRUCTIONS

Basic Script Implementation:
Use a simple script tag with type="module" and defer attribute to load JavaScript modules from JSDelivr CDN. The script will automatically load after HTML parsing and initialize when ready.

Basic Format:
<script type="module" defer src="https://cdn.jsdelivr.net/gh/username/repo@version/path/file.js"></script>

URL Structure:
- Base URL: https://cdn.jsdelivr.net/gh/
- Username: GitHub username
- Repository: repository name
- Version: can be commit hash, tag, or branch name
- Path: file path within repository
Example: https://cdn.jsdelivr.net/gh/user/project@d2b9d7a/feature/calc.js

Key Components:
1. type="module" - enables ES6 module features
2. defer - ensures script loads after HTML parsing
3. modules auto-initialize when loaded
4. no manual DOM ready check needed

Best Practices:
1. Use specific commit hashes for version control
2. Keep modules self-contained
3. Include error handling in module code
4. Check for required elements in module code
5. Auto-initialize safely
6. Handle missing dependencies gracefully

Module Structure:
1. Self-check for required elements
2. Handle missing dependencies
3. Initialize automatically
4. Fail gracefully if needed
5. Include necessary shared code

Important Notes:
1. Script loads after HTML parsing
2. Modules are automatically deferred
3. No manual initialization needed
4. Elements will exist when code runs
5. Keep modules independent
6. Test thoroughly

Alternative Implementation (if more control needed):
You can also use a more controlled approach with explicit DOM ready checks and error handling:
<script type="module" defer>
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const { default: initialize } = await import('cdn-url-here');
      if (document.querySelector('[required-element]')) {
        initialize();
      }
    } catch (error) {
      console.warn('Module failed to load:', error);
    }
  });
</script>

This approach provides more control but is usually unnecessary as the simple defer method handles most cases effectively.
