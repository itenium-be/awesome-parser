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

  t.deepEqual(result.contents, [
    {linkHref: '#platforms', linkText: 'Platforms', lists: []},
    {linkHref: '#programming-languages', linkText: 'Programming Languages', lists: []},
  ]);
});



test('it adds the awesome lists to the contents', t => {
  const awesomeAwesome = `
  ## Contents

  - [Platforms](#platforms)

  ## Platforms

  - [Node.js](https://github.com/sindresorhus/awesome-nodejs#readme) - Async non-blocking event-driven JavaScript runtime built on Chrome's V8 JavaScript engine.
  - [Frontend Development](https://github.com/dypsilon/frontend-dev-bookmarks#readme)
  `;

  const result = awesomeParser(awesomeAwesome);

  t.deepEqual(result.contents[0].lists, [
    {linkHref: 'https://github.com/sindresorhus/awesome-nodejs#readme', linkText: 'Node.js'},
    {linkHref: 'https://github.com/dypsilon/frontend-dev-bookmarks#readme', linkText: 'Frontend Development'},
  ]);
});
