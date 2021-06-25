declare module "@mdx-js/runtime" {
  const MDX: React.FC<{
    components?: React.ComponentType[],
    scope?: Record<any, any>
  }>

  export default MDX;
}