exports.monacoSuportedExtension = [
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

exports.cloudinarySupportedExtensions = [
  // Documents
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",

  // Images
  "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff",

  // Audio
  "mp3", "wav", "ogg", "aac", "flac", "m4a",

  // Video
  "mp4", "webm", "mov", "avi", "mkv"
];

exports.languageMapping = {
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
}

exports.getMediaType = (extension) => {
  const images = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"];
  const audios = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
  const videos = ["mp4", "webm", "mov", "avi", "mkv"];
  const docs = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];

  if(images.includes(extension)){
    return 'image';
  }
  else if(audios.includes(extension)){
    return 'audio';
  }
  else if(videos.includes(extension)){
    return 'video';
  }
  else if(docs.includes(extension)){
    return 'docs';
  }
  else{
    return 'pdf';
  }
;
}

exports.mapMediaTypeToCloudinaryResource = (mediaType) => {
  switch (mediaType) {
    case 'image':
      return 'image';
    case 'audio':
    case 'video':
      // Both audio and video are usually uploaded under 'video' in Cloudinary
      return 'video';
    case 'docs':
    case 'pdf':
    default:
      return 'raw'; // PDFs and docs go under 'raw'
  }
};
