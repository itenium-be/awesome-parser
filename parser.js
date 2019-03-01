const MarkdownIt = require('markdown-it');

function getBulletListTokens(tokens, header) {
  const contentsIndex = tokens.findIndex(x => x.markup === '##');
  if (tokens[contentsIndex + 1].content === header) {
    const relevantTokens = tokens.slice(contentsIndex);

    const bulletListStart = relevantTokens.findIndex(x => x.type === 'bullet_list_open');
    const bulletListEnd = relevantTokens.findIndex(x => x.type === 'bullet_list_close');

    const bulletList = relevantTokens.slice(bulletListStart, bulletListEnd);
    return bulletList;
  }
}


function readContents(contentTokens) {
  return contentTokens
    .filter(token => token.type === 'inline')
    .map(token => {
      return {
        linkText: token.children.find(x => x.type === 'text').content,
        linkHref: token.children.find(x => x.type === 'link_open').attrs[0][1]
      };
    });
}


module.exports = function(awesomeMd) {
  const md = new MarkdownIt();
  const result = md.parse(awesomeMd);

  const bulletList = getBulletListTokens(result, 'Contents');
  const contents = readContents(bulletList);

  for (let content of contents) {
    // content.lists = readLists();
  }

  return {
    contents
  };

  return 'Oh noes!';
}
