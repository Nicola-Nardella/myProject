const path = require('path')

const PORT = 8081
const BASE_URL = '/'
const SRC = path.join(__dirname, 'app')
const DEST = path.join(__dirname, 'build')

const PATHS = {
  images: {
    src: path.join(SRC, 'images/**/*'),
    dest: path.join(DEST, BASE_URL, 'images'),
  },
  styles: {
    src: path.join(SRC, 'styles/main.scss'),
    dest: path.join(DEST, BASE_URL, 'stylesheets'),
  },
  views: {
    src: path.join(SRC, 'html/index.html'),
    dest: DEST,
  },
  scripts: {
    src: path.join(SRC, 'scripts/main.js'),
    dest: path.join(DEST, BASE_URL, 'javascripts'),
  },
}

module.exports = {
  SRC,
  DEST,
  PORT,
  BASE_URL,
  PATHS,
}
