/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkchart2Excel"] = self["webpackChunkchart2Excel"] || []).push([["src_libs_Export2Excel_js"],{

/***/ "./src/libs/Export2Excel.js":
/*!**********************************!*\
  !*** ./src/libs/Export2Excel.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"export_table_to_excel\": function() { return /* binding */ export_table_to_excel; },\n/* harmony export */   \"export_json_to_excel\": function() { return /* binding */ export_json_to_excel; }\n/* harmony export */ });\n/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! file-saver */ \"./node_modules/file-saver/dist/FileSaver.min.js\");\n/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var xlsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xlsx */ \"./node_modules/xlsx/xlsx.js\");\n/* harmony import */ var xlsx__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(xlsx__WEBPACK_IMPORTED_MODULE_1__);\n/* eslint-disable */\r\n\r\n\r\n\r\nfunction generateArray(table) {\r\n  var out = [];\r\n  var rows = table.querySelectorAll('tr');\r\n  var ranges = [];\r\n  for (var R = 0; R < rows.length; ++R) {\r\n    var outRow = [];\r\n    var row = rows[R];\r\n    var columns = row.querySelectorAll('td');\r\n    for (var C = 0; C < columns.length; ++C) {\r\n      var cell = columns[C];\r\n      var colspan = cell.getAttribute('colspan');\r\n      var rowspan = cell.getAttribute('rowspan');\r\n      var cellValue = cell.innerText;\r\n      if (cellValue !== \"\" && cellValue == +cellValue) cellValue = +cellValue;\r\n\r\n      //Skip ranges\r\n      ranges.forEach(function (range) {\r\n        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {\r\n          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);\r\n        }\r\n      });\r\n\r\n      //Handle Row Span\r\n      if (rowspan || colspan) {\r\n        rowspan = rowspan || 1;\r\n        colspan = colspan || 1;\r\n        ranges.push({\r\n          s: {\r\n            r: R,\r\n            c: outRow.length\r\n          },\r\n          e: {\r\n            r: R + rowspan - 1,\r\n            c: outRow.length + colspan - 1\r\n          }\r\n        });\r\n      };\r\n\r\n      //Handle Value\r\n      outRow.push(cellValue !== \"\" ? cellValue : null);\r\n\r\n      //Handle Colspan\r\n      if (colspan)\r\n        for (var k = 0; k < colspan - 1; ++k) outRow.push(null);\r\n    }\r\n    out.push(outRow);\r\n  }\r\n  return [out, ranges];\r\n};\r\n\r\nfunction datenum(v, date1904) {\r\n  if (date1904) v += 1462;\r\n  var epoch = Date.parse(v);\r\n  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);\r\n}\r\n\r\nfunction sheet_from_array_of_arrays(data, opts) {\r\n  var ws = {};\r\n  var range = {\r\n    s: {\r\n      c: 10000000,\r\n      r: 10000000\r\n    },\r\n    e: {\r\n      c: 0,\r\n      r: 0\r\n    }\r\n  };\r\n  for (var R = 0; R != data.length; ++R) {\r\n    for (var C = 0; C != data[R].length; ++C) {\r\n      if (range.s.r > R) range.s.r = R;\r\n      if (range.s.c > C) range.s.c = C;\r\n      if (range.e.r < R) range.e.r = R;\r\n      if (range.e.c < C) range.e.c = C;\r\n      var cell = {\r\n        v: data[R][C]\r\n      };\r\n      if (cell.v == null) continue;\r\n      var cell_ref = xlsx__WEBPACK_IMPORTED_MODULE_1___default().utils.encode_cell({\r\n        c: C,\r\n        r: R\r\n      });\r\n\r\n      if (typeof cell.v === 'number') cell.t = 'n';\r\n      else if (typeof cell.v === 'boolean') cell.t = 'b';\r\n      else if (cell.v instanceof Date) {\r\n        cell.t = 'n';\r\n        cell.z = (xlsx__WEBPACK_IMPORTED_MODULE_1___default().SSF._table[14]);\r\n        cell.v = datenum(cell.v);\r\n      } else cell.t = 's';\r\n\r\n      ws[cell_ref] = cell;\r\n    }\r\n  }\r\n  if (range.s.c < 10000000) ws['!ref'] = xlsx__WEBPACK_IMPORTED_MODULE_1___default().utils.encode_range(range);\r\n  return ws;\r\n}\r\n\r\nfunction Workbook() {\r\n  if (!(this instanceof Workbook)) return new Workbook();\r\n  this.SheetNames = [];\r\n  this.Sheets = {};\r\n}\r\n\r\nfunction s2ab(s) {\r\n  var buf = new ArrayBuffer(s.length);\r\n  var view = new Uint8Array(buf);\r\n  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;\r\n  return buf;\r\n}\r\n\r\nfunction export_table_to_excel(id) {\r\n  var theTable = document.getElementById(id);\r\n  var oo = generateArray(theTable);\r\n  var ranges = oo[1];\r\n\r\n  /* original data */\r\n  var data = oo[0];\r\n  var ws_name = \"SheetJS\";\r\n\r\n  var wb = new Workbook(),\r\n    ws = sheet_from_array_of_arrays(data);\r\n\r\n  /* add ranges to worksheet */\r\n  // ws['!cols'] = ['apple', 'banan'];\r\n  ws['!merges'] = ranges;\r\n\r\n  /* add worksheet to workbook */\r\n  wb.SheetNames.push(ws_name);\r\n  wb.Sheets[ws_name] = ws;\r\n\r\n  var wbout = xlsx__WEBPACK_IMPORTED_MODULE_1___default().write(wb, {\r\n    bookType: 'xlsx',\r\n    bookSST: false,\r\n    type: 'binary'\r\n  });\r\n\r\n  (0,file_saver__WEBPACK_IMPORTED_MODULE_0__.saveAs)(new Blob([s2ab(wbout)], {\r\n    type: \"application/octet-stream\"\r\n  }), \"test.xlsx\")\r\n}\r\n\r\nfunction export_json_to_excel({\r\n  multiHeader = [],\r\n  header,\r\n  data,\r\n  filename,\r\n  merges = [],\r\n  autoWidth = true,\r\n  bookType = 'xlsx'\r\n} = {}) {\r\n  /* original data */\r\n  filename = filename || 'excel-list'\r\n  data = [...data]\r\n  data.unshift(header);\r\n\r\n  for (let i = multiHeader.length - 1; i > -1; i--) {\r\n    data.unshift(multiHeader[i])\r\n  }\r\n\r\n  var ws_name = \"SheetJS\";\r\n  var wb = new Workbook(),\r\n    ws = sheet_from_array_of_arrays(data);\r\n\r\n  if (merges.length > 0) {\r\n    if (!ws['!merges']) ws['!merges'] = [];\r\n    merges.forEach(item => {\r\n      ws['!merges'].push(xlsx__WEBPACK_IMPORTED_MODULE_1___default().utils.decode_range(item))\r\n    })\r\n  }\r\n\r\n  if (autoWidth) {\r\n    /*设置worksheet每列的最大宽度*/\r\n    const colWidth = data.map(row => row.map(val => {\r\n      /*先判断是否为null/undefined*/\r\n      if (val == null) {\r\n        return {\r\n          'wch': 10\r\n        };\r\n      }\r\n      /*再判断是否为中文*/\r\n      else if (val.toString().charCodeAt(0) > 255) {\r\n        return {\r\n          'wch': val.toString().length * 2\r\n        };\r\n      } else {\r\n        return {\r\n          'wch': val.toString().length\r\n        };\r\n      }\r\n    }))\r\n    /*以第一行为初始值*/\r\n    let result = colWidth[0];\r\n    for (let i = 1; i < colWidth.length; i++) {\r\n      for (let j = 0; j < colWidth[i].length; j++) {\r\n        if (result[j]['wch'] < colWidth[i][j]['wch']) {\r\n          result[j]['wch'] = colWidth[i][j]['wch'];\r\n        }\r\n      }\r\n    }\r\n    ws['!cols'] = result;\r\n  }\r\n\r\n  /* add worksheet to workbook */\r\n  wb.SheetNames.push(ws_name);\r\n  wb.Sheets[ws_name] = ws;\r\n\r\n  var wbout = xlsx__WEBPACK_IMPORTED_MODULE_1___default().write(wb, {\r\n    bookType: bookType,\r\n    bookSST: false,\r\n    type: 'binary'\r\n  });\r\n  (0,file_saver__WEBPACK_IMPORTED_MODULE_0__.saveAs)(new Blob([s2ab(wbout)], {\r\n    type: \"application/octet-stream\"\r\n  }), `${filename}.${bookType}`);\r\n}\r\n\r\n/* \r\nimport('@/vendor/Export2Excel').then(excel => {\r\n  const tHeader = ['网关号', '网关地址', '当前状态', '最后离线时间', '最后上线时间', '抄通量', '上下线次数', '网关坐标（x）', '网关坐标（y）']// 表头\r\n  const data = this.gatewaySourceData.map(v => {\r\n    return [\r\n      v.gatewayID,\r\n      v.location,\r\n      v.online ? '在线' : '离线',\r\n      this.timeFormatter('', '', v.lastOfftime),\r\n      this.timeFormatter('', '', v.lastShowTimeBegin),\r\n      v.throughNum,\r\n      v.onlineAndOfflineCount,\r\n      v.lng,\r\n      v.lat\r\n    ]\r\n  })\r\n  excel.export_json_to_excel({\r\n    header: tHeader,\r\n    data,\r\n    filename: '网关信息表' + new Date(new Date().getTime() + 28800000).toJSON().substr(0, 19).replace('T', '_')\r\n  })\r\n  this.downloadLoading = false\r\n}) */\r\n\n\n//# sourceURL=webpack://chart2Excel/./src/libs/Export2Excel.js?");

/***/ }),

/***/ "?e708":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (function() {

eval("/* (ignored) */\n\n//# sourceURL=webpack://chart2Excel/crypto_(ignored)?");

/***/ }),

/***/ "?58fb":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (function() {

eval("/* (ignored) */\n\n//# sourceURL=webpack://chart2Excel/fs_(ignored)?");

/***/ }),

/***/ "?20df":
/*!************************!*\
  !*** stream (ignored) ***!
  \************************/
/***/ (function() {

eval("/* (ignored) */\n\n//# sourceURL=webpack://chart2Excel/stream_(ignored)?");

/***/ })

}]);