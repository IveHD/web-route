const globalMap = new Map();
let ins = null;
function classD(path) {
console.log('path', path);
  return (target) => {
    globalMap.has
  }
}

function methodD(path) {
  return (target, name, descriptor) => {
    ins = target.constructor;
    globalMap.set(path, target.constructor);
    debugger
  }
  
}

@classD('/1')
class A {
  @methodD('/2')
  methodA() {}
}