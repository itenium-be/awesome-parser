import test from 'ava';
import awesomeParser from './parser.js';

// console.log(result.map(x => ({type: x.type, tag: x.tag, content: x.content})));


test('it reads the contents', t => {
  const awesomeAwesome = `
<div align="center"></div>

## Contents

- [Platforms](#platforms)
- [Programming Languages](#programming-languages)
`;

  const result = awesomeParser(awesomeAwesome);

  t.deepEqual(result, [
    {linkHref: 'platforms', linkText: 'Platforms', lists: [], desc: undefined},
    {linkHref: 'programming-languages', linkText: 'Programming Languages', lists: [], desc: undefined},
  ]);
});



test('it adds the awesome lists to the contents', t => {
  const awesomeAwesome = `
## Contents

- [Platforms](#platforms)

## Platforms

- [Node.js](https://github.com/sindresorhus/awesome-nodejs#readme)
- [Frontend Development](https://github.com/dypsilon/frontend-dev-bookmarks#readme)
  `;

  const result = awesomeParser(awesomeAwesome);

  t.deepEqual(result[0].lists, [
    {linkHref: 'https://github.com/sindresorhus/awesome-nodejs#readme', linkText: 'Node.js', desc: undefined, lists: []},
    {linkHref: 'https://github.com/dypsilon/frontend-dev-bookmarks#readme', linkText: 'Frontend Development', desc: undefined, lists: []},
  ]);
});



test('it adds the link desc if one exists', t => {
  const awesomeAwesome = `
## Contents

- [Platforms](#platforms)

## Platforms

- [Node.js](https://github.com/sindresorhus/awesome-nodejs#readme) - Async non-blocking event-driven JavaScript runtime built on Chrome's V8 JavaScript engine.
  `;

  const result = awesomeParser(awesomeAwesome);

  t.is(result[0].lists[0].desc, '- Async non-blocking event-driven JavaScript runtime built on Chrome\'s V8 JavaScript engine.');
});



test('it parses hierarchically', t => {
  const awesomeAwesome = `
  ## Contents

  - [Platforms](#platforms)

  ## Platforms

  - [macOS](https://github.com/iCHAIT/awesome-macOS#readme)
    - [Command-Line](https://github.com/herrbischoff/awesome-macos-command-line#readme)
    - [Screensavers](https://github.com/agarrharr/awesome-macos-screensavers#readme)
  - [JVM](https://github.com/deephacks/awesome-jvm#readme)
  `;

  const result = awesomeParser(awesomeAwesome);

  const platforms = result[0];
  t.deepEqual(platforms.lists.map(x => x.linkText), ['macOS', 'JVM']);

  const macOS = result[0].lists[0];
  t.deepEqual(macOS.lists.map(x => x.linkText), ['Command-Line', 'Screensavers']);
});



// https://raw.githubusercontent.com/vsouza/awesome-ios/master/README.md
// ### Content
// - [Courses](#courses)
// - [Code Quality](#code-quality)
//     - [Linter](#linter)
// ## Courses
// ### Getting Started
// *Courses, tutorials and guides*
// * [Apple- Start Developing with iOS](https://developer.apple.com/library/archive/referencelibrary/GettingStarted/DevelopiOSAppsSwift/) - Apple Guide.




// https://raw.githubusercontent.com/JStumpp/awesome-android/master/readme.md
// ### C&#35; ==> C#


// https://raw.githubusercontent.com/XamSome/awesome-xamarin/master/README.md
// - [AutoMapper ★5,724](https://github.com/AutoMapper/AutoMapper) - A convention-based object-object mapper in .NET.
// ==> remove the stars and add dynamically



// console.log(result.find(x => x.content === 'Platforms'));

// ATTN:
// Doesn't have "Contents"
// https://raw.githubusercontent.com/dypsilon/frontend-dev-bookmarks/master/README.md

// Content instead of Contents + 3 levels deep
// https://raw.githubusercontent.com/vsouza/awesome-ios/master/README.md

// TODO: A sublist may have a description...
