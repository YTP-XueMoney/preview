var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { R as Range, e as editor } from "./vendor-DvF0p2l6.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function rotateMatrix(x = 0, y = 0, rad = 0, cx = 0, cy = 0) {
  x -= cx, y -= cy;
  var newX = x * Math.cos(rad) - y * Math.sin(rad);
  var newY = x * Math.sin(rad) + y * Math.cos(rad);
  newX += cx, newY += cy;
  return {
    x: newX,
    y: newY
  };
}
let inputBuffer = [];
let currentIndex = 0;
let isfinish = 0;
self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    return "./assets/worker.js";
  }
};
function highlightLine(lineNumber) {
  if (!window.code_monaco) return;
  if (!window.decorations) {
    window.decorations = window.code_monaco.createDecorationsCollection([]);
  }
  window.decorations.set([
    {
      range: new Range(lineNumber + 1, 1, lineNumber + 1, 1),
      // 高亮当前行
      options: {
        isWholeLine: true,
        className: "myLineDecoration"
        // ✅ 使用行高亮样式
      }
    }
  ]);
}
function splitCodeSafely(code2) {
  let lines = [];
  let buffer = "";
  let insideForLoop = false;
  let parenDepth = 0;
  let insideForBody2 = false;
  for (let i2 = 0; i2 < code2.length; i2++) {
    let char = code2[i2];
    if (!insideForLoop && code2.slice(i2, i2 + 3) === "for") {
      insideForLoop = true;
      parenDepth = 1;
    }
    if (insideForLoop) {
      if (char === "(") parenDepth++;
      if (char === ")") parenDepth--;
      if (parenDepth === 0) {
        insideForLoop = false;
        insideForBody2 = true;
      }
    }
    if (insideForBody2) {
      if (char === "{") parenDepth++;
      if (char === "}") parenDepth--;
      if (parenDepth === 0) {
        insideForBody2 = false;
      }
    }
    if (char === ";" && insideForLoop && parenDepth === 2) {
      buffer += char;
    } else if (char === ";" || char == "\n" || char == "\r") {
      lines.push(buffer.trim() + char);
      buffer = "";
    } else {
      buffer += char;
    }
  }
  if (buffer.trim()) lines.push(buffer.trim());
  return lines;
}
function step() {
  return new Promise((resolve) => {
    document.getElementById("confirmButton").addEventListener("click", () => {
      resolve("用户确认");
    });
  });
}
const input = () => {
  if (currentIndex < inputBuffer.length) {
    return inputBuffer[currentIndex++];
  } else {
    return null;
  }
};
const print = (str) => {
  output_area.querySelector("#output-txt").innerHTML += str;
};
if (false) {
  print("This keeps print function from being removed.");
}
let ani_lines = [];
function isProxy(obj) {
  if (typeof obj != "object") return false;
  return obj.isProxy;
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function executeCode() {
  console.log("hamster run code");
  updateLoop_curLifeRound++;
  if (!window.code_monaco) {
    console.error("Monaco Editor 未初始化！");
    return;
  }
  const inputValue = window.input_monaco.getValue();
  inputBuffer = inputValue.split(/\s+/);
  currentIndex = 0;
  let code = window.code_monaco.getValue();
  if (!code) {
    console.error("代码为空，无法执行！");
    return;
  }
  let safeLines = splitCodeSafely(code);
  let processedLines = [];
  let insideForBody = false;
  let i = 0;
  safeLines.forEach((line, index) => {
    let trimmedLine = line.trim();
    if (line.includes("\n")) i++;
    if (trimmedLine === "" || trimmedLine.startsWith("//")) {
      processedLines.push(trimmedLine);
      return;
    }
    if (trimmedLine.startsWith("for")) {
      processedLines.push(trimmedLine);
      insideForBody = true;
      return;
    }
    processedLines.push(trimmedLine);
    if (trimmedLine[trimmedLine.length - 1] === ";") {
      processedLines.push(
        `highlightLine(${i});
console.log("Executing line ${i}");
if(isfinish)eval("process.exit(0)");`
      );
    }
  });
  let asyncCode = `(async () => {
${processedLines.join("\n")}
})()`;
  console.log(asyncCode);
  try {
    await eval(asyncCode);
  } catch (error) {
    console.error("Error at line:", error.stack);
  }
}
window.onload = () => {
  const code_editor = document.getElementById("code-editor");
  const input_area = document.getElementById("input-area");
  window.output_area = document.getElementById("output-area");
  const input_btn = document.querySelector("#input-area-btn");
  const output_btn = document.querySelector("#output-area-btn");
  window.code_monaco = editor.create(code_editor, {
    value: "output(input() + ', hello world.')\nlet mySegTree = new pack_segTree(13, 600, 40);",
    language: "javascript",
    theme: "vs-light",
    minimap: { enabled: false },
    automaticLayout: true
  });
  window.decorations = window.code_monaco.createDecorationsCollection([]);
  window.input_monaco = editor.create(input_area, {
    value: "",
    language: "plaintext",
    theme: "vs-light",
    minimap: { enabled: false },
    automaticLayout: true,
    lineNumbers: "off",
    // 關閉行號
    glyphMargin: false,
    // 移除左側行數間距
    folding: false,
    // 移除程式碼折疊功能（避免留白）
    lineDecorationsWidth: 5,
    // 移除行裝飾欄位
    lineNumbersMinChars: 0
    // 確保行數欄位不佔空間
  });
  document.getElementById("stop").addEventListener("click", () => {
    isfinish = 1;
    console.log("🚀 按钮已点击，isFinish =", isfinish);
    document.getElementById("confirmButton").click();
  });
  document.querySelector("#run").addEventListener("click", () => {
    document.getElementById("stop").click();
    isfinish = 0;
    const runcode = window.code_monaco.getValue();
    ani_lines = [];
    window.output_area.querySelector("#output-txt").innerHTML = "";
    executeCode(runcode);
    input_area.style.display = "none";
    window.output_area.style.display = "block";
    output_btn.classList.add("active-btn");
    input_btn.classList.remove("active-btn");
  });
  input_area.style.display = "block";
  window.output_area.style.display = "none";
  input_btn.classList.add("active-btn");
  document.querySelector("#input-area-btn").addEventListener("click", () => {
    input_area.style.display = "block";
    window.output_area.style.display = "none";
    input_btn.classList.add("active-btn");
    output_btn.classList.remove("active-btn");
  });
  document.querySelector("#output-area-btn").addEventListener("click", () => {
    input_area.style.display = "none";
    window.output_area.style.display = "block";
    output_btn.classList.add("active-btn");
    input_btn.classList.remove("active-btn");
  });
};
var svg = document.getElementById("mySvg");
var svgNull = document.createElementNS("http://www.w3.org/2000/svg", "circle");
svgNull.setAttribute("r", 0);
let frameT = 35;
let time = {
  prevFrame: Date.now(),
  curFrame: Date.now(),
  // deltaFrame: this.prevFrame - this.curFrame,
  deltaFrame: 0,
  delta: 0 / 1e3
};
let mouse = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
  dX: 0,
  dY: 0,
  hold: false
};
let updateLoop_count = 0;
let updateLoop_curLifeRound = 0;
function updateLoop(self2) {
  if ("updateLoop_myLifeRound" in self2) {
    if (self2.updateLoop_myLifeRound < updateLoop_curLifeRound)
      Reflect.defineProperty(self2, "$deleted", {
        value: true,
        enumerable: true
      });
  } else {
    Reflect.defineProperty(self2, "updateLoop_myLifeRound", {
      value: updateLoop_curLifeRound,
      enumerable: true
    });
  }
  if ("$deleted" in self2 && self2.$deleted) {
    if ("delete" in self2) self2.delete();
    return;
  }
  updateLoop_count++;
  setTimeout(() => {
    self2.update();
  }, frameT);
}
function DelegationHandler(delegaionNames) {
  return {
    get(target, prop, receiver) {
      if (prop == "isProxy") return true;
      if (prop in target) return Reflect.get(target, prop);
      else {
        for (let name of delegaionNames) {
          let nextTarget = target[name];
          if (isProxy(nextTarget) || prop in nextTarget) {
            let result = Reflect.get(nextTarget, prop);
            if (result != void 0) return result;
          }
        }
        return void 0;
      }
    },
    set(target, prop, value) {
      if (prop in target) return Reflect.set(target, prop, value);
      else {
        for (let name of delegaionNames) {
          if (target[name] == void 0 || target[name] == null) continue;
          if ((isProxy(target[name]) || prop in target[name]) && Reflect.set(target[name], prop, value))
            return true;
        }
        return false;
      }
    }
  };
}
function Delegation(target, delegaionNames) {
  for (let prop of delegaionNames)
    if (!(prop in target)) throw Error(`${prop} doesn't exist in ${target}`);
  return new Proxy(target, DelegationHandler(delegaionNames));
}
class pointer {
  constructor(val = 0) {
    __publicField(this, "pointer_isPointer", true);
    __publicField(this, "_val");
    this._val = val;
    return Delegation(this, ["val"]);
  }
  valueOf() {
    return this.val;
  }
  get val() {
    if (this._val != null && (this._val.constructor.name == "pointer" || this._val.constructor.name == "refer"))
      return this._val.val;
    else return this._val;
  }
  set val(val) {
    if (this._val.constructor.name == "pointer" || this._val.constructor.name == "refer")
      this._val.val = val;
    else {
      if (val !== this) this._val = val;
      else {
        console.error(
          "can't define a pointer's final target to itself",
          this,
          val,
          this == val
        );
      }
    }
  }
  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.valueOf();
    }
    if (hint === "string") {
      return toString(this.valueOf());
    }
    return this.valueOf();
  }
}
class refer {
  constructor(getFunc, setFunc = null) {
    __publicField(this, "getFunc");
    __publicField(this, "setFunc");
    __publicField(this, "pointer_isPointer", true);
    this.getFunc = getFunc;
    this.setFunc = setFunc;
    return Delegation(this, ["val"]);
  }
  get val() {
    if (typeof this.getFunc !== "function") {
      console.error("⚠️ Error: getFunc is not a function!", this);
      return new pointer(null);
    }
    let result = this.getFunc();
    if (result === void 0) {
      console.error("⚠️ Error: getFunc() returned undefined!", this);
      return new pointer(null);
    }
    let ret = new pointer(result);
    return ret.val;
  }
  set val(val) {
    if (this.setFunc != null) this.setFunc(val);
  }
  valueOf() {
    return this.val;
  }
}
class svg_AttributeSetter {
  constructor(svg2, att, val) {
    __publicField(this, "svg", new pointer());
    __publicField(this, "att", new pointer());
    __publicField(this, "val", new pointer());
    this.svg._val = svg2;
    this.att._val = att;
    this.val._val = val;
  }
  update() {
    this.svg.val.setAttribute(this.att.val, this.val.val);
  }
}
let svg_AS = svg_AttributeSetter;
class svg_AttributeSetterArray {
  constructor() {
    __publicField(this, "svgASA", []);
    __publicField(this, "_svg");
  }
  set svg(svg2) {
    for (let svgAS of this.svgASA) svgAS.svg = svg2;
    this._svg = svg2;
  }
  get svg() {
    return this._svg;
  }
  append(svg2, att, val) {
    this.svgASA.push(new svg_AS(svg2, att, val));
  }
  update() {
    for (let i2 = 0; i2 < this.svgASA.length; i2++) this.svgASA[i2].update();
  }
}
let svg_ASA = svg_AttributeSetterArray;
class Coordinate2d {
  constructor(_x = 0, _y = 0) {
    __publicField(this, "x", new pointer(0));
    __publicField(this, "y", new pointer(0));
    this.x.val = _x;
    this.y.val = _y;
  }
  distance(other) {
    return Math.sqrt(
      Math.pow(this.x.val - other.x.val, 2) + Math.pow(this.y.val - other.y.val, 2)
    );
  }
  dist(other) {
    return this.distance(other);
  }
  len() {
    return Math.sqrt(this.x.val * this.x.val + this.y.val * this.y.val);
  }
  static distance(a, b) {
    return Math.sqrt(
      Math.pow(a.x.val - b.x.val, 2) + Math.pow(a.y.val - b.y.val, 2)
    );
  }
  static dist(a, b) {
    return this.distance(a, b);
  }
  static len(a) {
    return a.x.val * a.x.val + a.y.val * a.y.val;
  }
  static unit(me) {
    var r2 = Math.sqrt(me.x.val * me.x.val + me.y.val * me.y.val);
    if (r2 == 0) return new Coordinate2d(1, 0);
    return new Coordinate2d(me.x.val / r2, me.y.val / r2);
  }
}
class obj_Dot {
  constructor(_x = 0, _y = 0, _vx = 0, _vy = 0) {
    __publicField(this, "pos", new Coordinate2d());
    __publicField(this, "velocity", new Coordinate2d());
    this.pos.x.val = _x;
    this.pos.y.val = _y;
    this.velocity.x.val = _vx;
    this.velocity.y.val = _vy;
    this.update();
  }
  update() {
    this.pos.x.val += this.velocity.x.val * time.delta;
    this.pos.y.val += this.velocity.y.val * time.delta;
    updateLoop(this);
  }
}
class obj_Circle {
  constructor(_x = 0, _y = 0, _r = 0) {
    __publicField(this, "dot", new obj_Dot());
    __publicField(this, "pos", dot.pos);
    __publicField(this, "velocity", dot.velocity);
    __publicField(this, "r", 0);
    dot = obj_Dot(_x, _y);
    r = _r;
  }
}
class obj_Box {
  constructor(_height = 1e3, _width = 1e3, _x = 0, _y = 0) {
    __publicField(this, "dot", new obj_Dot());
    __publicField(this, "pos", this.dot.pos);
    __publicField(this, "height", new pointer());
    __publicField(this, "width", new pointer());
    __publicField(this, "containing", []);
    this.height.val = _height;
    this.width.val = _width;
    this.pos.x.val = _x;
    this.pos.y.val = _y;
    this.update();
  }
  append(newObj) {
    this.containing.push(newObj);
  }
  update() {
    var up = this.pos.y.val - this.height.val;
    var down = this.pos.y.val + this.height.val;
    var left = this.pos.x.val - this.width.val;
    var right = this.pos.x.val + this.width.val;
    for (var i2 = 0; i2 < this.containing.length; i2++) {
      let curObj = this.containing[i2];
      let r2 = 0;
      if (curObj.r != null) r2 = curObj.r;
      if (curObj.pos.y.val < up + r2) {
        curObj.pos.y.val = up + r2;
        curObj.velocity.y.val = 0;
      }
      if (curObj.pos.y.val > down - r2) {
        curObj.pos.y.val = down - r2;
        curObj.velocity.y.val = 0;
      }
      if (curObj.pos.x.val < left + r2) {
        curObj.pos.x.val = left + r2;
        curObj.velocity.x.val *= -1;
      }
      if (curObj.pos.x.val > right - r2) {
        curObj.pos.x.val = right - r2;
        curObj.velocity.x.val *= -1;
      }
    }
    updateLoop(this);
  }
}
class obj_Gravity {
  constructor(_k) {
    __publicField(this, "k", new pointer(1));
    __publicField(this, "containing", []);
    this.k = _k;
    this.update();
  }
  append(newObj) {
    this.containing.push(newObj);
  }
  update() {
    for (var i2 = 0; i2 < this.containing.length; i2++)
      for (var j = i2 + 1; j < this.containing.length; j++) {
        let curObj1 = this.containing[i2];
        let curObj2 = this.containing[j];
        let posVector = new Coordinate2d(
          curObj2.pos.x - curObj1.pos.x,
          curObj2.pos.y - curObj1.pos.y
        );
        let r2 = Math.pow(posVector.len(), 1);
        posVector = Coordinate2d.unit(posVector);
        curObj1.velocity.x.val += posVector.x.val * this.k * time.delta / r2;
        curObj1.velocity.y.val += posVector.y.val * this.k * time.delta / r2;
        curObj2.velocity.x.val -= posVector.x.val * this.k * time.delta / r2;
        curObj2.velocity.y.val -= posVector.y.val * this.k * time.delta / r2;
      }
    updateLoop(this);
  }
}
class obj_break {
  constructor(_break = 1, _maxV = 10) {
    __publicField(this, "maxV", new pointer(10));
    __publicField(this, "break", new pointer(1));
    __publicField(this, "containing", []);
    this.break.val = _break;
    this.maxV.val = _maxV;
    this.update();
  }
  append(newObj) {
    this.containing.push(newObj);
  }
  update() {
    for (var i2 = 0; i2 < this.containing.length; i2++) {
      var curObj = this.containing[i2];
      var velocity = curObj.velocity.len();
      var vX = curObj.velocity.x;
      var vY = curObj.velocity.y;
      vX.val -= vX.val / velocity * time.delta * 2;
      vY.val -= vY.val / velocity * time.delta * 2;
      vX.val *= Math.pow(this.break, time.delta);
      vY.val *= Math.pow(this.break, time.delta);
      if (velocity > this.maxV) {
        curObj.velocity.x.val /= velocity / this.maxV;
        curObj.velocity.y.val /= velocity / this.maxV;
      }
    }
    updateLoop(this);
  }
}
class obj_repulsion {
  constructor(_k = 10, _r = 50) {
    __publicField(this, "k", new pointer(10));
    __publicField(this, "r", new pointer(50));
    __publicField(this, "containing", []);
    this.k.val = _k;
    this.r.val = _r;
    this.update();
  }
  append(newObj) {
    this.containing.push(newObj);
  }
  update() {
    for (var i2 = 0; i2 < this.containing.length; i2++)
      for (var j = i2 + 1; j < this.containing.length; j++) {
        let curObj1 = this.containing[i2];
        let curObj2 = this.containing[j];
        let posVector = new Coordinate2d(
          curObj2.pos.x - curObj1.pos.x,
          curObj2.pos.y - curObj1.pos.y
        );
        let d = posVector.len();
        let r2 = Math.pow(posVector.len(), 1);
        posVector = Coordinate2d.unit(posVector);
        if (d <= this.r) {
          curObj1.velocity.x.val -= posVector.x.val * this.k * time.delta / r2;
          curObj1.velocity.y.val -= posVector.y.val * this.k * time.delta / r2;
          curObj2.velocity.x.val += posVector.x.val * this.k * time.delta / r2;
          curObj2.velocity.y.val += posVector.y.val * this.k * time.delta / r2;
        }
      }
    updateLoop(this);
  }
}
class obj_array {
  constructor(_x = pointer(0), _y = pointer(0), _gap = pointer(50), _rad = pointer(0)) {
    __publicField(this, "dot", new obj_Dot());
    __publicField(this, "pos", this.dot.pos);
    __publicField(this, "gap", new pointer(50));
    __publicField(this, "rad", new pointer(0));
    __publicField(this, "refers", []);
    __publicField(this, "containing", []);
    this.pos.x = _x;
    this.pos.y = _y;
    this.gap = _gap;
    this.rad = _rad;
    this.update();
  }
  append(newObject, index) {
    this.containing.push({ obj: newObject, index });
  }
  update() {
    for (var i2 = 0; i2 < this.containing.length; i2++) {
      var obj = this.containing[i2].obj;
      var index = this.containing[i2].index;
      var xy = rotateMatrix(
        this.pos.x + index * this.gap,
        this.pos.y,
        this.rad,
        this.pos.x,
        this.pos.y
      );
      obj.x.val = xy.x;
      obj.y.val = xy.y;
    }
    updateLoop(this);
  }
}
class obj_bound {
  constructor(obj1, obj2, minr = null, maxr = null, k = 1e3) {
    __publicField(this, "obj1", new pointer());
    __publicField(this, "obj2", new pointer());
    __publicField(this, "minr", new pointer());
    __publicField(this, "maxr", new pointer());
    __publicField(this, "k", new pointer());
    __publicField(this, "$deleted", false);
    this.obj1._val = obj1;
    this.obj2._val = obj2;
    this.minr._val = minr;
    this.maxr._val = maxr;
    this.k._val = k;
    this.update();
  }
  delete() {
    this.$deleted = true;
  }
  update() {
    if (this.$deleted) return;
    let obj1 = this.obj1;
    let obj2 = this.obj2;
    let pos1 = obj1.pos;
    let pos2 = obj2.pos;
    let posVector = new Coordinate2d(pos2.x - pos1.x, pos2.y - pos1.y);
    let d = posVector.len();
    posVector = Coordinate2d.unit(posVector);
    if (d < this.minr) {
      let move = Math.min(this.minr - d, this.k * time.delta);
      move = (this.minr - d) / 1.5;
      pos1.x.val -= posVector.x.val * move / 2;
      pos1.y.val -= posVector.y.val * move / 2;
      pos2.x.val += posVector.x.val * move / 2;
      pos2.y.val += posVector.y.val * move / 2;
    }
    if (d > this.maxr) {
      let move = Math.min(d - this.maxr, this.k * time.delta);
      move = (d - this.maxr) / 1.5;
      pos1.x.val += posVector.x.val * move / 2;
      pos1.y.val += posVector.y.val * move / 2;
      pos2.x.val -= posVector.x.val * move / 2;
      pos2.y.val -= posVector.y.val * move / 2;
    }
    updateLoop(this);
  }
}
class svg_bridge {
  constructor(svgObj = null) {
    __publicField(this, "_svgObj", new pointer(null));
    __publicField(this, "$deleted", false);
    __publicField(this, "svgASA", new svg_ASA());
    this.svgObj = svgObj;
    return Delegation(this, ["svgObj"]);
  }
  get svgObj() {
    return this._svgObj;
  }
  set svgObj(val) {
    if (this._svgObj.val != null) svg.removeChild(this._svgObj.val);
    this._svgObj._val = val;
    if (this._svgObj.val != null) {
      this.svgASA.svg = this.svgObj;
      svg.appendChild(this._svgObj.val);
    }
  }
  addAttribute(att, val) {
    Reflect.defineProperty(this, att, val);
    this.svgASA.append(new pointer(this.svgObj), att, val);
  }
  setAttribute(att, val) {
    this._svgObj.val.setAttribute(att, val);
  }
  getAttribute(att) {
    return this.svgObj.val.getAttribute(att);
  }
  addEventListener(eventType, func) {
    this._svgObj.val.addEventListener(eventType, func);
  }
  delete() {
    this.$deleted = true;
    this.svgObj = null;
  }
  update() {
    if (this.$deleted) return;
    this.svgASA.update();
  }
}
class svg_hold {
  constructor(svgBridge, pos) {
    //  under svg_bridge
    __publicField(this, "svgBridge", new pointer());
    // svg_bridge
    __publicField(this, "curSvgObj", new pointer());
    __publicField(this, "holding", false);
    __publicField(this, "pos", new pointer());
    __publicField(this, "dX");
    __publicField(this, "dY");
    __publicField(this, "$deleted", false);
    this.svgBridge._val = svgBridge;
    this.curSvgObj._val = svgBridge.svgObj;
    this.pos._val = pos;
    this.curSvgObj.val.addEventListener(
      "mousedown",
      this.triggerFunction.bind(this)
    );
    this.curSvgObj.val.addEventListener(
      "mouseup",
      this.releaseFunction.bind(this)
    );
    this.update();
  }
  triggerFunction(event) {
    if (this.$deleted) return;
    event.preventDefault();
    this.holding = true;
    this.dX = this.svgBridge.getAttribute("cx") - mouse.x;
    this.dY = this.svgBridge.getAttribute("cy") - mouse.y;
  }
  releaseFunction(event) {
    event.preventDefault();
  }
  update() {
    if (this.svgBridge.val.svgObj.val !== this.curSvgObj) {
      if (this.curSvgObj.val != null) {
        this.curSvgObj.val.removeEventListener(
          "mousedown",
          this.triggerFunction.bind(this)
        );
      }
      this.curSvgObj._val = this.svgBridge.svgObj.val;
      if (this.curSvgObj.val != null) {
        this.curSvgObj.val.addEventListener(
          "mousedown",
          this.triggerFunction.bind(this)
        );
      }
    }
    if (this.holding) {
      this.pos.x.val = this.dX + mouse.x;
      this.pos.y.val = this.dY + mouse.y;
      if (!mouse.hold) {
        svg_layerSortTrigger = true;
        this.holding = false;
      }
    }
    updateLoop(this);
  }
  delete() {
    this.$deleted = true;
    this.curSvgObj.val.removeEventListener(
      "mousedown",
      this.triggerFunction.bind(this)
    );
  }
}
let svg_layerSortTrigger = false;
class svg_layer {
  constructor(svgObj, layer) {
    __publicField(this, "svgObj");
    // svg_bridge
    __publicField(this, "_layer", new pointer(0));
    this.svgObj = svgObj;
    this.layer = layer;
  }
  get layer() {
    return this._layer;
  }
  set layer(val) {
    if (this._layer == val) return;
    svg_layerSortTrigger = true;
    this._layer.val = val;
    this.svgObj.setAttribute("layer", this._layer.val);
  }
  update() {
    updateLoop(this);
  }
}
class pack_basic {
  constructor(svgObj, x = 0, y = 0) {
    __publicField(this, "dot", new pointer(new obj_Dot()));
    __publicField(this, "pos", new pointer(this.dot.pos));
    __publicField(this, "velocity", new pointer(this.dot.velocity));
    __publicField(this, "svgBridge");
    __publicField(this, "holder");
    __publicField(this, "hide", new pointer(false));
    __publicField(this, "fill", new pointer());
    __publicField(this, "stroke", new pointer());
    __publicField(this, "$fill", new pointer(this.fill));
    __publicField(this, "$stroke", new pointer(this.stroke));
    __publicField(this, "hover", new pointer());
    __publicField(this, "$deleted", false);
    __publicField(this, "svgLayer");
    __publicField(this, "mark", new pointer(false));
    __publicField(this, "markFill", new pointer("red"));
    __publicField(this, "markStroke", new pointer("black"));
    this.svgBridge = new pointer(new svg_bridge(svgObj));
    this.pos.x._val = x;
    this.pos.y._val = y;
    this.svgBridge.addAttribute(
      "cx",
      new refer(
        (function() {
          return this.pos.x.val;
        }).bind(this)
      )
    );
    this.svgBridge.addAttribute(
      "cy",
      new refer(
        (function() {
          return this.pos.y.val;
        }).bind(this)
      )
    );
    this.svgBridge.addAttribute(
      "visibility",
      new refer(
        (function() {
          if (this.hide.val) return "hidden";
          else return "visible";
        }).bind(this)
      )
    );
    this.svgBridge.addEventListener(
      "mouseenter",
      (function() {
        this.hover._val = true;
      }).bind(this)
    );
    this.svgBridge.addEventListener(
      "mouseleave",
      (function() {
        this.hover._val = false;
      }).bind(this)
    );
    this.fill._val = this.svgBridge.getAttribute("fill");
    this.stroke._val = this.svgBridge.getAttribute("stroke");
    this.svgBridge.addAttribute("fill", this.$fill);
    this.svgBridge.addAttribute("stroke", this.$stroke);
    this.holder = new svg_hold(this.svgBridge, this.pos);
    this.svgLayer = new svg_layer(this.svgBridge, new pointer(1));
    this.update();
    return Delegation(this, ["svgBridge", "dot"]);
  }
  set svgObj(svgObj) {
    this.svgBridge.val.svgObj = svgObj;
    this.fill._val = this.svgBridge.getAttribute("fill");
    this.stroke._val = this.svgBridge.getAttribute("stroke");
  }
  get svgObj() {
    return this.svgBridge.svgObj;
  }
  get layer() {
    return this.svgLayer.layer;
  }
  set layer(val) {
    this.svgLayer.layer = val;
  }
  delete() {
    this.$deleted = true;
    this.svgBridge.delete();
    this.holder.delete();
  }
  update() {
    if (this.$deleted) return;
    if (this.mark.val) {
      this.$fill._val = this.markFill;
      this.$stroke._val = this.markStroke;
    } else {
      this.$fill._val = this.fill;
      this.$stroke._val = this.stroke;
    }
    this.svgBridge.update();
    updateLoop(this);
  }
}
class pack_circle {
  constructor(pos = { x: 0, y: 0 }, r2 = 20, text = "") {
    __publicField(this, "packBasic", new pack_basic(svgCircle.cloneNode()));
    __publicField(this, "pos", this.packBasic.pos);
    __publicField(this, "r", new pointer());
    __publicField(this, "text", new pointer(null));
    __publicField(this, "packText", new pointer(
      new pack_text(new pointer(this.text), this.pos.x, this.pos.y)
    ));
    __publicField(this, "$deleted", false);
    this.pos.x.val = pos.x;
    this.pos.y.val = pos.y;
    this.r.val = r2;
    this.packBasic.svgBridge.addAttribute("r", new pointer(this.r));
    this.text._val = text;
    this.packText.packBasic.layer = this.packBasic.layer + 1e-3;
    this.packText.hide._val = this.packBasic.hide;
    return Delegation(this, ["packBasic"]);
  }
  delete() {
    this.$deleted = true;
    this.packBasic.delete();
    this.packText.delete();
  }
}
class pack_square {
  constructor(x = 200, y = 200, width = 40, height = 40, text = "") {
    __publicField(this, "packBasic", new pack_basic(svgSquare.cloneNode()));
    __publicField(this, "pos", this.packBasic.pos);
    __publicField(this, "width", new pointer(20));
    __publicField(this, "height", new pointer(20));
    __publicField(this, "rotate", new pointer(0));
    __publicField(this, "refer", new Proxy(this, refer));
    __publicField(this, "$deleted");
    __publicField(this, "svgX", new pointer(
      new refer(
        (function() {
          return this.pos.x - this.width / 2;
        }).bind(this)
      ),
      (function(val) {
        this.pos.x.val = val + this.width / 2;
      }).bind(this)
    ));
    __publicField(this, "svgY", new pointer(
      new refer(
        (function() {
          return this.pos.y - this.height / 2;
        }).bind(this)
      ),
      (function(val) {
        this.pos.y.val = val + this.height / 2;
      }).bind(this)
    ));
    __publicField(this, "text", new pointer(null));
    __publicField(this, "packText", new pointer(
      new pack_text(new pointer(this.text), this.pos.x, this.pos.y)
    ));
    this.pos.x._val = x;
    this.pos.y._val = y;
    this.width._val = width;
    this.height._val = height;
    this.packBasic.svgBridge.addAttribute("x", this.svgX);
    this.packBasic.svgBridge.addAttribute("y", this.svgY);
    this.packBasic.svgBridge.addAttribute("width", new pointer(this.width));
    this.packBasic.svgBridge.addAttribute("height", new pointer(this.height));
    this.packBasic.svgBridge.addAttribute(
      "transform",
      new refer(
        (function() {
          return this.rotateTransform;
        }).bind(this)
      )
    );
    this.text._val = text;
    this.packText.packBasic.layer = this.packBasic.layer + 1e-3;
    return Delegation(this, ["packBasic"]);
  }
  get rotateTransform() {
    return new pointer(
      `rotate(${this.rotate.val} ${this.pos.x.val} ${this.pos.y.val})`
    );
  }
  delete() {
    this.$deleted = true;
    this.packBasic.delete();
    this.packText.delete();
  }
}
class pack_text {
  constructor(text = "text", x = 120, y = 120) {
    __publicField(this, "packBasic", new pack_basic(svgText.cloneNode()));
    __publicField(this, "pos", this.packBasic.pos);
    __publicField(this, "x", new pointer(
      new refer(
        (function() {
          return this.pos.x.val;
        }).bind(this),
        (function(val) {
          this.pos.x.val = val;
        }).bind(this)
      )
    ));
    __publicField(this, "y", new pointer(
      new refer(
        (function() {
          return this.pos.y.val;
        }).bind(this),
        (function(val) {
          this.pos.y.val = val;
        }).bind(this)
      )
    ));
    __publicField(this, "text", new pointer("text"));
    __publicField(this, "$deleted", false);
    __publicField(this, "rotate", new pointer(0));
    this.pos.x._val = x;
    this.pos.y._val = y;
    this.text._val = text;
    this.packBasic.addAttribute("x", this.x);
    this.packBasic.addAttribute("y", this.y);
    this.packBasic.addAttribute(
      "transform",
      new refer(
        (function() {
          return this.rotateTransform;
        }).bind(this)
      )
    );
    this.packBasic.layer = 10;
    this.packBasic.holder.delete();
    this.packBasic.markFill._val = "brown";
    this.packBasic.markStroke._val = "none";
    this.update();
    return Delegation(this, ["packBasic"]);
  }
  get rotateTransform() {
    return new pointer(
      `rotate(${this.rotate.val} ${this.pos.x.val} ${this.pos.y.val})`
    );
  }
  get val() {
    return this.text.val;
  }
  set val(val) {
    this.text.val = val;
  }
  get _val() {
    return this.text._val;
  }
  set _val(val) {
    this.text._val = val;
  }
  valueOf() {
    return parseInt(this.text.val);
  }
  toString() {
    return this.text.val;
  }
  delete() {
    this.$deleted = true;
    this.packBasic.delete();
  }
  update() {
    if (this.$deleted) return;
    Reflect.set(this.packBasic.svgObj, "textContent", this.text.val);
    updateLoop(this);
  }
}
class pack_line {
  constructor(obj1, obj2, noForce = false, arrow = false) {
    __publicField(this, "packBasic", new pack_basic(svgLine.cloneNode()));
    __publicField(this, "obj1", new pointer());
    __publicField(this, "obj2", new pointer());
    __publicField(this, "pos1", new pointer());
    __publicField(this, "pos2", new pointer());
    // svgASA = new svg_ASA();
    __publicField(this, "bound");
    __publicField(this, "packText", new pointer(
      new pack_text(
        "",
        new refer(
          (function() {
            return (this.pos1.x + this.pos2.x) / 2;
          }).bind(this)
        ),
        new refer(
          (function() {
            return (this.pos1.y + this.pos2.y) / 2;
          }).bind(this)
        )
      )
    ));
    __publicField(this, "$deleted");
    __publicField(this, "arrow", new pointer(null));
    this.obj1._val = obj1;
    this.obj2._val = obj2;
    this.pos1._val = this.obj1.pos;
    this.pos2._val = this.obj2.pos;
    this.packBasic.addAttribute(
      "x1",
      new refer(
        (function() {
          return this.pos1.x.val;
        }).bind(this)
      )
    );
    this.packBasic.addAttribute(
      "y1",
      new refer(
        (function() {
          return this.pos1.y.val;
        }).bind(this)
      )
    );
    this.packBasic.addAttribute(
      "x2",
      new refer(
        (function() {
          return this.pos2.x.val;
        }).bind(this)
      )
    );
    this.packBasic.addAttribute(
      "y2",
      new refer(
        (function() {
          return this.pos2.y.val;
        }).bind(this)
      )
    );
    this.packBasic.svgLayer = new svg_layer(this.packBasic, new pointer(0));
    this.packBasic.holder.delete();
    this.packBasic.hide._val = new refer(
      (function() {
        return this.obj1.hide != void 0 && this.obj1.hide.val || this.obj2.hide != void 0 && this.obj2.hide.val;
      }).bind(this)
    );
    if (noForce) this.bound = new obj_bound(this.obj1, this.obj2, 0, Infinity);
    else this.bound = new obj_bound(this.obj1, this.obj2, 100, 150);
    if (arrow) {
      this.arrow._val = new pack_line(
        {
          pos: new refer(
            (function() {
              return new Coordinate2d(
                (1 * this.pos1.x + 3 * this.pos2.x) / 4,
                (1 * this.pos1.y + 3 * this.pos2.y) / 4
              );
            }).bind(this)
          )
        },
        {
          pos: new refer(
            (function() {
              return new Coordinate2d(
                (0.99 * this.pos1.x + 3.01 * this.pos2.x) / 4,
                (0.99 * this.pos1.y + 3.01 * this.pos2.y) / 4
              );
            }).bind(this)
          )
        },
        true
      );
      this.arrow.setAttribute("marker-end", "url(#arrow)");
      this.arrow.hide._val = this.packBasic.hide;
    }
    this.packBasic.markStroke._val = "red";
    this.update();
    return Delegation(this, ["packBasic", "packText"]);
  }
  get posCenter() {
    return new Coordinate2d(
      (this.pos1.x + this.pos2.x) / 2,
      (this.pos1.y + this.pos2.y) / 2
    );
  }
  delete() {
    this.$deleted = true;
    this.packBasic.delete();
    this.bound.delete();
    if (this.arrow._val != null) this.arrow.delete();
  }
  update() {
    updateLoop(this);
  }
}
class pack_array {
  constructor(pos = new Coordinate2d(50, 50), gap = new pointer(50), rad = new pointer(0)) {
    __publicField(this, "dot", new obj_Dot());
    __publicField(this, "pos", new pointer(this.dot.pos));
    __publicField(this, "gap", new pointer(50));
    __publicField(this, "rad", new pointer(0));
    __publicField(this, "size", 0);
    __publicField(this, "$deleted", false);
    __publicField(this, "hide", new pointer(false));
    __publicField(this, "containing", []);
    __publicField(this, "_defaultArray", []);
    __publicField(this, "defaultArray", new Proxy(this, {
      get: (target, prop) => {
        if (prop == "isProxy") return true;
        let tarArray = target._defaultArray;
        if (prop in tarArray) return Reflect.get(tarArray, prop);
        if (!isNaN(Number(prop))) return Reflect.get(tarArray, prop);
        else return void 0;
      },
      set: (target, prop, value) => {
        console.log(prop);
        console.log(Number(prop));
        if (!isNaN(Number(prop))) {
          {
            let tarArray = target._defaultArray;
            prop = Number(prop);
            if (prop < 0) return false;
            if (typeof value != "object") value = new pack_text(value);
            let tmp = void 0;
            if (typeof tarArray[prop] == "object" && "delete" in tarArray[prop])
              tmp = tarArray[prop];
            let ret = Reflect.set(tarArray, prop, value);
            if (ret == true && tmp != void 0) tmp.delete();
            while (target.maxIndex < target.defaultArray.length - 1)
              target.$increaseSize();
            return ret;
          }
        } else return false;
      }
    }));
    __publicField(this, "boxArray", []);
    __publicField(this, "maxIndex", -1);
    this.pos._val = pos;
    this.gap._val = gap;
    this.rad._val = rad;
    this.update();
    return Delegation(this, ["dot", "defaultArray"]);
  }
  posGetter(index) {
    let xy = rotateMatrix(
      this.pos.x + (index + 1) * this.gap,
      this.pos.y,
      this.rad,
      this.pos.x,
      this.pos.y
    );
    return new Coordinate2d(xy.x, xy.y);
  }
  $increaseSize() {
    this.maxIndex += 1;
    let newBox = new pack_square();
    newBox.svgObj = pack_array_svgBox.cloneNode();
    newBox.layer = 0.5;
    newBox.height._val = this.gap;
    newBox.width._val = this.gap;
    newBox.rotate._val = new refer(
      (function() {
        return this.rad.val / Math.PI * 180;
      }).bind(this)
    );
    newBox.holder.delete();
    newBox.pos._val = this.coord(this.maxIndex);
    newBox.hide._val = this.hide;
    this.boxArray[this.maxIndex] = newBox;
  }
  $decreaseSize() {
    this.maxIndex -= 1;
    this.boxArray.pop().delete();
  }
  append(coord, index) {
    this.containing.push({ coord, index });
    while (this.maxIndex < index) {
      this.$increaseSize();
    }
  }
  coord(index, adjustSize = true) {
    return new refer(
      (function() {
        return this.posGetter(index);
      }).bind(this)
    );
  }
  release(index) {
    let ret = this._defaultArray[index];
    this._defaultArray[index] = void 0;
    return ret;
  }
  // append(val)
  // {
  //   this.containing.push({ coord: coord, index: index });
  // }
  delete(keepElements = false) {
    this.$deleted = true;
    if (!keepElements) {
      for (var i2 = 0; i2 < this.defaultArray.length; i2++) {
        if (typeof this.defaultArray[i2] == "object" && "delete" in this.defaultArray[i2])
          this.defaultArray[i2].delete();
      }
    }
    for (var i2 = 0; i2 < this.boxArray.length; i2++) this.boxArray[i2].delete();
  }
  update() {
    if (this.$deleted) return;
    for (var i2 = 0; i2 < this.containing.length; i2++) {
      let coord = this.containing[i2].coord;
      let index = this.containing[i2].index;
      let newCoord = this.posGetter(index);
      coord.x.val = newCoord.x.val;
      coord.y.val = newCoord.y.val;
    }
    for (var i2 = 0; i2 < this.defaultArray.length; i2++) {
      if (typeof this.defaultArray[i2] != "object") continue;
      let coord = this.defaultArray[i2].pos;
      let index = i2;
      let newCoord = this.posGetter(index);
      coord.x.val = newCoord.x.val;
      coord.y.val = newCoord.y.val;
      this.defaultArray[i2].hide.val = this.hide.val;
    }
    while (this.maxIndex < this.defaultArray.length - 1) this.$increaseSize();
    updateLoop(this);
  }
}
{
  var svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  svgLine.setAttribute("stroke", "gray");
  svgLine.setAttribute("stroke-width", "4");
  var arrowHead = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  arrowHead.setAttribute("fill", "gray");
  arrowHead.setAttribute("points", "0, 0 10, 5 0, 10");
  arrowHead.setAttribute("refX", "5");
  arrowHead.setAttribute("refY", "5");
  arrowHead.setAttribute("transfer", "(100, 100)");
}
{
  var svgCircleMarker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  svgCircleMarker.setAttribute("cx", 100);
  svgCircleMarker.setAttribute("cy", 100);
  svgCircleMarker.setAttribute("r", "30");
  svgCircleMarker.setAttribute("fill", "none");
  svgCircleMarker.setAttribute("stroke", "red");
  svgCircleMarker.setAttribute("stroke-width", "4");
  svgCircleMarker.setAttribute("layer", "1");
}
{
  var svgCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  svgCircle.setAttribute("cx", 100);
  svgCircle.setAttribute("cy", 100);
  svgCircle.setAttribute("r", "20");
  svgCircle.setAttribute("fill", "white");
  svgCircle.setAttribute("stroke", "black");
  svgCircle.setAttribute("stroke-width", "4");
  svgCircle.setAttribute("layer", "1");
}
{
  var svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  svgText.textContent = "txc";
  svgText.setAttribute("cx", 120);
  svgText.setAttribute("cy", 120);
  svgText.setAttribute("x", 120);
  svgText.setAttribute("y", 120);
  svgText.setAttribute("dominant-baseline", "middle");
  svgText.setAttribute("text-anchor", "middle");
  svgText.setAttribute("innerHTML", "txc");
}
{
  var svgSquare = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  svgSquare.setAttribute("x", 100);
  svgSquare.setAttribute("y", 100);
  svgSquare.setAttribute("width", "40");
  svgSquare.setAttribute("height", "40");
  svgSquare.setAttribute("fill", "white");
  svgSquare.setAttribute("stroke", "black");
  svgSquare.setAttribute("stroke-width", "4");
  svgSquare.setAttribute("layer", "1");
}
{
  var pack_array_svgBox = svgSquare.cloneNode();
  pack_array_svgBox.setAttribute("stroke-width", "2");
  pack_array_svgBox.setAttribute("stroke", "gray");
}
function updateTime() {
  time.prevFrame = time.curFrame;
  time.curFrame = Date.now();
  time.deltaFrame = time.curFrame - time.prevFrame;
  time.delta = time.deltaFrame / 1e3;
}
function sortByLayerCmp(a, b) {
  if (a.getAttribute("layer") < b.getAttribute("layer")) return -1;
  if (a.getAttribute("layer") >= b.getAttribute("layer")) return 1;
  return 0;
}
function sortByLayer() {
  var indexes = svg.querySelectorAll("[layer]");
  var indexesArray = Array.from(indexes);
  let sorted = indexesArray.sort(sortByLayerCmp);
  sorted.forEach((e) => svg.appendChild(e));
}
var theEvent = null;
window.addEventListener("mousemove", function(event) {
  theEvent = event;
});
window.addEventListener("mousedown", function(event) {
  mouse.hold = true;
});
window.addEventListener("mouseup", function(event) {
  mouse.hold = false;
});
window.addEventListener("keydown", function(event) {
  if (event.code === "Space" || event.key === " ") {
  }
});
sortByLayer();
function update() {
  updateTime();
  updateLoop_count = 0;
  if (svg_layerSortTrigger) {
    sortByLayer();
    svg_layerSortTrigger = false;
  }
  if (theEvent != null) {
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = theEvent.clientX;
    mouse.y = theEvent.clientY;
    mouse.dX = mouse.x - mouse.lastX;
    mouse.dY = mouse.y - mouse.lastY;
  }
  setTimeout(update, frameT);
}
update();
class pack_segTree {
  constructor(size, len, height) {
    __publicField(this, "pos", new pointer(new Coordinate2d()));
    __publicField(this, "sepDist", new pointer(10));
    __publicField(this, "size", new pointer());
    __publicField(this, "len", new pointer());
    __publicField(this, "height", new pointer());
    __publicField(this, "contain", []);
    __publicField(this, "holder", new pointer());
    this.size._val = size;
    this.len._val = len;
    this.height._val = height;
    this.pos.x._val = 400;
    this.pos.y._val = 100;
    this.build();
    this.holder._val = new svg_hold(
      this.contain[0].packBasic.svgBridge,
      this.pos
    );
  }
  build(L = 0, R = this.size.val - 1, id = 0, len = this.len, center = this.pos.x, depth = 0) {
    this.contain[id] = new pack_square(
      new refer(
        (function(center2) {
          return center2.val;
        }).bind(this, center),
        function(val) {
        }
      ),
      new refer(
        (function(depth2) {
          return this.pos.y.val + depth2 * (this.sepDist + this.height);
        }).bind(this, depth),
        function(val) {
        }
      ),
      len,
      this.height,
      `[${L}, ${R}]`
    );
    this.contain[id].packBasic.holder.delete();
    if (L != R) {
      var M = Math.floor((L + R) / 2);
      this.build(
        L,
        M,
        id * 2 + 1,
        new refer(
          (function(len2) {
            return (len2 - this.sepDist) / 2;
          }).bind(this, len)
        ),
        new refer(
          (function(len2, center2) {
            return center2 - len2 / 4 - this.sepDist / 4;
          }).bind(this, len, center)
        ),
        depth + 1
      );
      this.build(
        M + 1,
        R,
        id * 2 + 2,
        new refer(
          (function(len2) {
            return (len2 - this.sepDist) / 2;
          }).bind(this, len)
        ),
        new refer(
          (function(len2, center2) {
            return center2 + len2 / 4 + this.sepDist / 4;
          }).bind(this, len, center)
        ),
        depth + 1
      );
    }
  }
}
//# sourceMappingURL=index-BgKbsABF.js.map
