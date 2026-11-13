"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_lib_api_client_ts";
exports.ids = ["_ssr_lib_api_client_ts"];
exports.modules = {

/***/ "(ssr)/./lib/api/client.ts":
/*!***************************!*\
  !*** ./lib/api/client.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiClient: () => (/* binding */ apiClient)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"(ssr)/../../node_modules/axios/lib/axios.js\");\n\nconst apiClient = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({\n    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',\n    timeout: 10000\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9saWIvYXBpL2NsaWVudC50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUEwQjtBQUVuQixNQUFNQyxZQUFZRCw2Q0FBS0EsQ0FBQ0UsTUFBTSxDQUFDO0lBQ3BDQyxTQUFTQyxRQUFRQyxHQUFHLENBQUNDLG1CQUFtQixJQUFJO0lBQzVDQyxTQUFTO0FBQ1gsR0FBRyIsInNvdXJjZXMiOlsiL1VzZXJzL21hY2Jvb2twcm9tMS9kZXZlbG9wL0RJRU5fTEFOSF9NSU5IX05IQVQvYXBwcy93ZWIvbGliL2FwaS9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcblxuZXhwb3J0IGNvbnN0IGFwaUNsaWVudCA9IGF4aW9zLmNyZWF0ZSh7XG4gIGJhc2VVUkw6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9VUkwgfHwgJy9hcGknLFxuICB0aW1lb3V0OiAxMF8wMDAsXG59KTtcbiJdLCJuYW1lcyI6WyJheGlvcyIsImFwaUNsaWVudCIsImNyZWF0ZSIsImJhc2VVUkwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfQVBJX1VSTCIsInRpbWVvdXQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./lib/api/client.ts\n");

/***/ })

};
;