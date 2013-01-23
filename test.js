var esprima = require('esprima');
var fs = require("fs");
var loggerScript = fs.readFileSync("./logger.js").toString();

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
    var key, child;

    if (visitor.call(null, object) === false) {
        return;
    }
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor)
            }
        }
    }
}

parsed = esprima.parse(loggerScript)


//console.log(JSON.stringify(parsed, null, 4));  


variables = []

traverse(parsed, function(node){

  if(node.type==="VariableDeclaration"){
    node.declarations.forEach(function(decl){
      console.log(JSON.stringify(decl.id.name, null, 2)); 
      variables.push(decl.id.name)
    });
  }
});

traverse(parsed, function(node){
  if(node.type==="ExpressionStatement"){
    if(node.expression.type==="AssignmentExpression"&&node.expression.left.type==="Identifier"){
      console.log(JSON.stringify(node.expression, null, 2));
    }
  }
});

// traverse(parsed, function(node){
//   if(node.type==="VariableDeclaration"){
//     node.declarations.forEach(function(decl){
//       console.log(JSON.stringify(decl.id.name, null, 4)); 
//       variables.push(decl.id.name)
//     });
//   }
// });

  

