import { parse } from "@babel/parser";
import generate from "@babel/generator";
import injectParams from "./injectParams";

export default function transform(source: string) {
  const ast = parse(source, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript"
    ]
  });

  injectParams(ast, this.resourcePath);

  return `
    ${generate(ast).code}
  `;
}