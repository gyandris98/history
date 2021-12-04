/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  const value: any;
  export = value;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}
