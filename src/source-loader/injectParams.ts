import estraverse from "estraverse";
import { readFileSync } from "fs";

function findParameterNode(node: any) {
  // @ts-ignore
  let parameterPropertyNode = node.properties.find(childNode => childNode.type === "ObjectProperty" && childNode.key.name === "parameters");

  // Parameter already exist, so we add our parameters
  if (parameterPropertyNode) {
    return parameterPropertyNode;
  }

  node.properties.push({
    type: "ObjectProperty",
    key: {
      type: "Identifier",
      name: "parameters"
    },
    value: {
      type: "ObjectExpression",
      properties: []
    }
  });

  // @ts-ignore
  return node.properties.find(childNode => childNode.type === "ObjectProperty" && childNode.key.name === "parameters");
}

export default function injectParams(ast: any, storyPath: string) {
  const extension = storyPath.split('.').pop();

  let sourceCodeFilePath: string;
  let sourceCode: string;

  // Get component name and its source path
  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: node => {
      if (node.type === "Program" && node.body) {
        const exportDefaultDeclarationNode = node.body.find(childNode => childNode.type === "ExportDefaultDeclaration");

        // @ts-ignore
        const componentName: string = exportDefaultDeclarationNode.declaration.properties.find(
          (p: any) => p.type === 'ObjectProperty' && p.key.name === 'component'
        ).value.name

        if (componentName) {
          estraverse.traverse(ast, {
            fallback: 'iteration',
            enter: node => {
              if (node.type === "Program" && node.body) {
                const importNode = node.body.find(
                  childNode => childNode.type === 'ImportDeclaration' && childNode.specifiers.find(s => s.local.name === componentName)
                );

                if (importNode) {
                  // @ts-ignore
                  sourceCodeFilePath = `${storyPath.substr(0, storyPath.lastIndexOf("/"))}/${importNode.source.value.replace(/\.\//ig, '')}.${extension}`;

                  sourceCode = readFileSync(sourceCodeFilePath).toString();
                }
              }
            }
          })
        }
      }
    }
  })

  // Inject liveEdit Params
  estraverse.replace(ast, {
    fallback: "iteration",
    enter: node => {
      if (node.type === "Program" && node.body) {
        const exportDefaultDeclarationNode = node.body.find(childNode => childNode.type === "ExportDefaultDeclaration");

        // @ts-ignore
        const parametersNode = findParameterNode(exportDefaultDeclarationNode.declaration);

        parametersNode.value.properties.push({
          type: "ObjectProperty",
          key: {
            type: "Identifier",
            name: "liveEdit"
          },
          value: {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'ObjectProperty',
                computed: false,
                shorthand: false,
                method: false,
                key: {
                  type: "Identifier",
                  name: "sourceCodePath",
                },
                value: {
                  type: "StringLiteral",
                  value: sourceCodeFilePath,
                }
              },
              {
                type: 'ObjectProperty',
                computed: false,
                shorthand: false,
                method: false,
                key: {
                  type: "Identifier",
                  name: "sourceCode",
                },
                value: {
                  type: "StringLiteral",
                  value: sourceCode,
                }
              }
            ]
          },
        });
      }

      return node;
    }
  });
}