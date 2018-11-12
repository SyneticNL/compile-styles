An extensive task to compile SCSS files

Settings object:
{
  source: [],
  dest: dest,
  ignore: [`${pattern}*`],
  "browsersupport": [
    "> 1%",
    "last 2 versions",
    "IE 9"
  ],
  "minify": false,
  "gzip": false,
  "compass": false,
  "exclude": [],
  "sourcemaps": {
    "enable": true,
    "location": "/",
    "settings": {
      "init": {},
      "write": {
        "addcomment": true,
        "destpath": ""
      }
    }
  },
  "flatten": true,
  "pxtorem": {
    "enabled": true,
    "settings": {
      "rootValue": 16,
      "replace": false
    }
  }
}