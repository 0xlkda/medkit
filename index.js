export fucntion warp(fn, {
  onbefore,
  onafter,
  onerror,
}) {
  
var originalFunction = fn;

fn = function*() {
  /* work before the function is called */
  let before = yield onbefore()
  
  try {
    var returnValue = originalFunction.apply(this, arguments); /* #2 */
    /* work after the function is called */
    yield onafter(returnValue)
    
    return returnValue;
  }
  catch (e) {
    /* work in case there is an error */
    onerror(e)
  }
}

for(var prop in originalFunction) { /* #3 */
   if (originalFunction.hasOwnProperty(prop)) 
     fn[prop] = originalFunction[prop];
 }
}

return fn
}
