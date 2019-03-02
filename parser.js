const MarkdownIt = require('markdown-it');

function getBulletListTokens(tokens, header, level) {
  let remainingTokens = tokens;
  while (remainingTokens.length) {
    const headerIndex = remainingTokens.findIndex(x => x.markup === '##');
    if (headerIndex === -1) {
      return [];
    }

    remainingTokens = remainingTokens.slice(headerIndex + 1);
    if (remainingTokens[0].content === header) {
      const bulletListStart = remainingTokens.findIndex(x => x.type === 'bullet_list_open');
      const bulletListLevel = remainingTokens[bulletListStart].level;
      const bulletListEnd = remainingTokens.findIndex(x => x.type === 'bullet_list_close' && x.level === bulletListLevel);

      const bulletList = remainingTokens.slice(bulletListStart, bulletListEnd);
      return bulletList;
    }
  }
}


function getAwesomeLinks(bulletListTokens) {
  const inlineTokens = bulletListTokens.filter(token => token.type === 'inline');
  if (!inlineTokens.length) {
    return [];
  }

  const level = inlineTokens[0].level;
  return inlineTokens
    .reduce((acc, token) => {
      const entry = {
        linkText: token.children.find(x => x.type === 'text').content,
        linkHref: token.children.find(x => x.type === 'link_open').attrs[0][1].replace(/^\s*#/, ''),
        desc: token.children.length === 4 ? token.children[3].content.trim() : undefined,
        lists: [],
      };

      if (token.level === level) {
        acc.push(entry);
      } else {
        acc[acc.length - 1].lists.push(entry);
      }

      return acc;
    }, []);
}


module.exports = function(awesomeMd) {
  const md = new MarkdownIt();
  const result = md.parse(awesomeMd);

  const bulletList = getBulletListTokens(result, 'Contents');
  const contents = getAwesomeLinks(bulletList);

  for (let content of contents) {
    const contentTokens = getBulletListTokens(result, content.linkText);
    content.lists = getAwesomeLinks(contentTokens);
  }

  return contents;
}
