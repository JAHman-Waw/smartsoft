module.exports = {
  preset: "../../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "html"],
  coverageDirectory: "../../../../coverage/libs/trans/shell/angular",
  globals: { "ts-jest": { tsConfig: "<rootDir>/tsconfig.spec.json" } },
  displayName: "trans-shell-angular",
};
