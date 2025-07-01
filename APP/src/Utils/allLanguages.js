// languages.js
export const monacoSupportedLanguages = [
  'abap', 'apex', 'azcli', 'bat', 'bicep', 'c', 'cameligo', 'clojure', 'coffeescript',
  'cpp', 'csharp', 'csp', 'css', 'dart', 'dockerfile', 'ecl', 'elixir', 'flow9', 'fsharp',
  'go', 'graphql', 'handlebars', 'hcl', 'html', 'ini', 'java', 'javascript', 'json',
  'julia', 'kotlin', 'less', 'lexon', 'liquid', 'lua', 'm3', 'markdown', 'mips', 'msdax',
  'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'plaintext',
  'postiats', 'powerquery', 'powershell', 'proto', 'pug', 'python', 'qsharp', 'r',
  'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scala',
  'scheme', 'scss', 'shell', 'sol', 'sparql', 'sql', 'st', 'swift', 'systemverilog',
  'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml', 'dotenv', 'jade', 'asciidoc'
];


export const cloudinarySupportedExtensions = [
  // Documents
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",

  // Images
  "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff",

  // Audio
  "mp3", "wav", "ogg", "aac", "flac", "m4a",

  // Video
  "mp4", "webm", "mov", "avi", "mkv"
];

export const monacoSuportedExtension = [
  // Web
  "js", "ts", "jsx", "tsx", "html", "htm", "css", "scss", "less", "json",

  // Backend / Scripting
  "py", "java", "c", "cpp", "cs", "go", "rb", "php", "rs", "sh", "pl", "swift", "kt", "m", "r",

  // Data / Markup
  "xml", "yml", "yaml", "toml", "ini", "csv", "md",

  // Configs / Build / Infra
  "env", "dockerfile", "makefile", "gitignore", "npmrc", "eslintignore", "prettierrc",

  // Plain Text
  "txt", "log", "text",

  // Dev Tools
  "babelrc", "eslintrc", "prettierrc", "editorconfig", "tsconfig", "webpack.config.js", "babel.config.js",

  // Markdown / Documentation
  "md", "markdown", "rst", "adoc",

  // Templates
  "ejs", "hbs", "pug", "mustache",

  // SQL / Queries
  "sql", "graphql", "gql",

  // Other Dev Formats
  "vue", "svelte"
];


const extensionToMonacoLanguageMap = {
  "js": "javascript",
  "ts": "typescript",
  "jsx": "javascript",
  "tsx": "typescript",
  "html": "html",
  "htm": "html",
  "css": "css",
  "scss": "scss",
  "less": "less",
  "json": "json",

  "py": "python",
  "java": "java",
  "c": "c",
  "cpp": "cpp",
  "cs": "csharp",
  "go": "go",
  "rb": "ruby",
  "php": "php",
  "rs": "rust",
  "sh": "shell",
  "pl": "perl",
  "swift": "swift",
  "kt": "kotlin",
  "m": "objective-c",
  "r": "r",

  "xml": "xml",
  "yml": "yaml",
  "yaml": "yaml",
  "toml": "toml",
  "ini": "ini",
  "csv": "csv",
  "md": "markdown",

  "env": "dotenv",
  "dockerfile": "dockerfile",
  "makefile": "makefile",
  "gitignore": "gitignore",
  "npmrc": "properties",
  "eslintignore": "gitignore",
  "prettierrc": "json",

  "txt": "plaintext",
  "log": "plaintext",
  "text": "plaintext",

  "babelrc": "json",
  "eslintrc": "json",
  "prettierrc": "json",
  "editorconfig": "ini",
  "tsconfig": "json",
  "webpack.config.js": "javascript",
  "babel.config.js": "javascript",

  "markdown": "markdown",
  "rst": "restructuredtext",
  "adoc": "asciidoc",

  "ejs": "html",
  "hbs": "handlebars",
  "pug": "jade",
  "mustache": "handlebars",

  "sql": "sql",
  "graphql": "graphql",
  "gql": "graphql",

  "vue": "vue",
  "svelte": "svelte"
};


export function mapExtensionToLanguage(name,defaultLang){
  const extension = name.split('.').at(-1).toLowerCase();
  if(!name.includes('.')){
    return defaultLang;
  }
  return extensionToMonacoLanguageMap[extension];
}

export function isMimeExtensionMatch(mimeType, extension) {
  const mimeToExtensionsMap = {
    // Documents
    'application/pdf': ['pdf'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'application/vnd.ms-powerpoint': ['ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
    'application/vnd.ms-excel': ['xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],

    // Images
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'image/svg+xml': ['svg'],
    'image/bmp': ['bmp'],
    'image/tiff': ['tiff'],

    // Audio
    'audio/mpeg': ['mp3'],
    'audio/wav': ['wav'],
    'audio/ogg': ['ogg'],
    'audio/aac': ['aac'],
    'audio/flac': ['flac'],
    'audio/mp4': ['m4a'],

    // Video
    'video/mp4': ['mp4'],
    'video/webm': ['webm'],
    'video/quicktime': ['mov'],
    'video/x-msvideo': ['avi'],
    'video/x-matroska': ['mkv'],
  };

  extension = extension.toLowerCase();

  if (!mimeToExtensionsMap[mimeType]) return false;

  return mimeToExtensionsMap[mimeType].includes(extension);
}


export const languageToDeviconMap = {
  abap: "abap",
  apex: "salesforce",
  azcli: "azuredevops",
  bat: "windows8",
  bicep: "azuredevops",
  c: "c",
  cameligo: "ocaml",
  clojure: "clojure",
  coffeescript: "coffeescript",
  cpp: "cplusplus",
  csharp: "csharp",
  csp: "git",
  css: "css3",
  dart: "dart",
  dockerfile: "docker",
  ecl: "eclipseide",
  elixir: "elixir",
  flow9: "flow",
  fsharp: "fsharp",
  go: "go",
  graphql: "graphql",
  handlebars: "handlebars",
  hcl: "hashicorp",
  html: "html5",
  ini: "vscode",
  java: "java",
  javascript: "javascript",
  json: "vscode",
  julia: "julia",
  kotlin: "kotlin",
  less: "less",
  lexon: "vscode",
  liquid: "liquid",
  lua: "lua",
  m3: "vscode",
  markdown: "markdown",
  mips: "vscode",
  msdax: "vscode",
  mysql: "mysql",
  "objective-c": "apple",
  pascal: "pascal",
  pascaligo: "pascal",
  perl: "perl",
  pgsql: "postgresql",
  php: "php",
  plaintext: "vscode",
  postiats: "vscode",
  powerquery: "powerbi",
  powershell: "powershell",
  proto: "vscode",
  pug: "pug",
  python: "python",
  qsharp: "vscode",
  r: "r",
  razor: "dotnet",
  redis: "redis",
  redshift: "amazonwebservices",
  restructuredtext: "markdown",
  ruby: "ruby",
  rust: "rust",
  sb: "scala",
  scala: "scala",
  scheme: "vscode",
  scss: "sass",
  shell: "bash",
  sol: "solidity",
  sparql: "vscode",
  sql: "mysql",
  st: "vscode",
  swift: "swift",
  systemverilog: "vscode",
  tcl: "vscode",
  twig: "twig",
  typescript: "typescript",
  vb: "dotnet",
  xml: "xml",
  yaml: "yaml",
  dotenv: "vscode",
  jade: "pug",
  asciidoc: "asciidoctor",
  gitignore: "git",
  gitkeep: "git",
  gitattributes: "git",
  npmrc: "npm",
  eslintignore: "eslint",
  prettierrc: "prettier",
  babelrc: "babel",
  eslintrc: "eslint",
  editorconfig: "vscode",
  tsconfig: "typescript",
  "webpack.config.js": "webpack",
  "babel.config.js": "babel"
};
