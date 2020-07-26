module.exports = {
   presets: [
  //   '@vue/cli-plugin-babel/preset'
  ['@vue/cli-plugin-babel/preset'],
  ["@babel/preset-env", { "modules": false }]
   ],
    "plugins": [
      [
        "component",
        {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }
      ]
    ]
}
