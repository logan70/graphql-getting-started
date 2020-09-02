const fs = require('fs');
const path = require('path');

const {
  HEADER,
} = require('./constant');

const {
  resolve,
  getChapterDirs,
  genLink,
  getAllMarkDowns,
} = require('./utils');

function main() {
  generateRootReadme();
  replaceAllLinksInMarkDownFiles();
}

function generateRootReadme() {
  const chapterDirs = getChapterDirs();
  const contentStr = chapterDirs.reduce((str, chapter) => {
    str += getTitle(chapter);
    str += getNoteLink(chapter);
    return str;
  }, '');
  const readmeStr = HEADER + contentStr;
  const readmePath = resolve('README.md');
  fs.writeFileSync(readmePath, readmeStr, 'utf-8');
  replaceLinks(readmePath)
}

function replaceAllLinksInMarkDownFiles() {
  const mdFiles = getAllMarkDowns();
  mdFiles.forEach(file => replaceLinks(file))
}

const genLinkReg = /genLink\(['']?(.+?)['']?\)/ig;
function replaceLinks(mdFilePath) {
  if (!fs.existsSync(mdFilePath))
    return console.log(`${mdFilePath} is not exist`);
  
  const mdFileDir = path.resolve(mdFilePath, '..')
  const readmeStr = fs
    .readFileSync(mdFilePath, 'utf-8')
    .replace(genLinkReg, (_, imgPath) => genLink(mdFileDir, imgPath));
  fs.writeFileSync(mdFilePath, readmeStr, 'utf-8');
}

function getTitle(chapter) {
  const title = /\d+-(.*)/.exec(chapter)[1]
  return `## ${title}\n\n`;
}

function getNoteLink(chapter) {
  const noteFile = resolve(chapter, 'README.md');
  if (!fs.existsSync(noteFile)) return '';
  return `[**Learning Note**](${genLink(chapter)})\n\n`;
}

main();
