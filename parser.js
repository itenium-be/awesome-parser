const MarkdownIt = require('markdown-it');

function getBulletListTokens(tokens, header) {
  let remainingTokens = tokens;
  while (remainingTokens.length) {
    const headerIndex = remainingTokens.findIndex(x => x.markup === '##');
    if (headerIndex === -1) {
      return [];
    }

    remainingTokens = remainingTokens.slice(headerIndex + 1);
    if (remainingTokens[0].content === header) {
      const bulletListStart = remainingTokens.findIndex(x => x.type === 'bullet_list_open');
      const bulletListEnd = remainingTokens.findIndex(x => x.type === 'bullet_list_close');

      const bulletList = remainingTokens.slice(bulletListStart, bulletListEnd);
      return bulletList;
    }
  }
}


function getAwesomeLinks(bulletListTokens) {
  return bulletListTokens
    .filter(token => token.type === 'inline')
    .map(token => {
      return {
        linkText: token.children.find(x => x.type === 'text').content,
        linkHref: token.children.find(x => x.type === 'link_open').attrs[0][1],
        desc: token.children.length === 4 ? token.children[3].content.trim() : undefined,
      };
    });
}


module.exports = function(awesomeMd) {
  const md = new MarkdownIt();
  const result = md.parse(awesomeMd);

  // console.log(result.find(x => x.content === 'Platforms'));

  const bulletList = getBulletListTokens(result, 'Contents');
  const contents = getAwesomeLinks(bulletList);

  for (let content of contents) {
    const contentTokens = getBulletListTokens(result, content.linkText);
    content.lists = getAwesomeLinks(contentTokens);
  }

  return {
    contents
  };

  return 'Oh noes!';
}
