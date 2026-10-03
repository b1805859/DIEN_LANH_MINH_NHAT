# UI consistency verification

- Server: http://127.0.0.1:3001
- Routes: 87 / 87
- Viewport checks: 204
- Passed: 212
- Failed: 0
- Uncaught browser errors: 0
- Network writes intercepted: 3


The source preservation audit excludes common chrome (intentionally unified), CSS class/style attributes and the booking input CSS token. It compares public page content, image paths, form values, URLs and metadata against the saved pre-edit source. Screenshots cover desktop and mobile examples; 320px overflow is checked on every public route.