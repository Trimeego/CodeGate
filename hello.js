var esprima = require('esprima');
var coffee = require("coffee-script")
var fs = require("fs");

// var javaScript = fs.readFileSync("./sample.js").toString();

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

path = ("/Users/jdouglas/github/ICG/visual/temp/scripts/");
files = fs.readdirSync(path)
files.forEach(function(file){
  var javaScript = fs.readFileSync(path+file)
  parsed = esprima.parse(javaScript)


  variables = []

  //Find all of the variables
  traverse(parsed, function(node){ 
    if(node.type==="VariableDeclaration"){
      node.declarations.forEach(function(decl){
        variables.push({id:decl.id.name})
      });
    }
  });

  function markVariables(varArray, filterFunc){
      vars = varArray.filter(filterFunc)
      vars.forEach(function(v){
        v.used = true
      });
  }


  //Traverse the tree looking for use of variables
  traverse(parsed, function(node){
    switch(node.type){
      case "BinaryExpression":
        markVariables(variables, function(i){return i.id==node.left.name ||i.id==node.right.name})
        break;

      case "CallExpression":
        if(node.callee){
          markVariables(variables, function(i){return i.id==node.callee.name})
          node.arguments.forEach(function(arg){
            markVariables(variables, function(i){return i.id==arg.name});
          });
        }
        break;
        
      case "MemberExpression":
        markVariables(variables, function(i){return (node.object && i.id==node.object.name) || (node.property && i.id==node.property.name)})
        break;

      case "ArrayExpression":
        if(node.elements){
          node.elements.forEach(function(elm){
            markVariables(variables, function(i){return i.id==elm.name});
          });
        }
        break;
        
      case "ExpressionStatement":
        markVariables(variables, function(i){return (node.expression && i.id==node.expression.name)})
        if(node.expression.arguments){
          node.expression.arguments.forEach(function(arg){
            markVariables(variables, function(i){return i.id==arg.name});
          });
        }
        break;
        
      case "IfStatement":
      case "WhileStatement":
        markVariables(variables, function(i){return node.test && i.id==node.test.name});
        break;
        
      case "ForInStatement":
        markVariables(variables, function(i){return node.right && i.id==node.right.name});
        break;
        
      case "VariableDeclaration":
        node.declarations.forEach(function(decl){
          markVariables(variables, function(i){return decl.init && i.id==decl.init.name});
        });
        break;
        
      case "ReturnStatement":
        markVariables(variables, function(i){return node.argument && (i.id==node.argument.name || (node.argument.left && i.id==node.argument.left.name))});
        break;    

    }


  });

  var notUsed = variables.filter(function(v){return !v.used})
  console.log(file)
  if(notUsed.length > 0){
    console.log(notUsed);
  }
  

  // var results = esprima.parse(javaScript);



  //Experiments

  // do we assign any variables that we do not use?

  // console.log(JSON.stringify(results, null, 2));
});
