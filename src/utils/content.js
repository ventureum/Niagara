import commonmark from 'commonmark'
let reader = new commonmark.Parser()
const forbidenTypes = [
  'code',
  'block_quote',
  'item', 'list',
  'heading',
  'code_block',
  'html_block',
  'html_inline',
  'link',
  'emph',
  'strong'
]

function processContent (title, text) {
  let parsed = reader.parse(text)
  const walker = parsed.walker()
  let event, node
  let subtitleEnd = false
  let imageCaptured = false
  let returnObject = {
    title,
    text,
    image: '',
    subtitle: ''
  }
  let subtitle = ''
  let characterLimit = 150
  let skipType = []
  while (event = walker.next()) {
    node = event.node
    // Detect unallowed types
    if (forbidenTypes.includes(node.type)) {
      return false
    }
    // allowed types that are not text
    if (event.entering &&
      !(node.type === 'paragraph' || node.type === 'text') &&
      !(node.type === 'thematic_break' || node.type === 'softbreak')
    ) {
      skipType.push(node.type)
    } else if (!event.entering && skipType[skipType.length - 1] === node.type) {
      skipType.pop()
    }
    if (node.type === 'image' && event.entering && !imageCaptured) {
      imageCaptured = true
      returnObject = { ...returnObject, image: node.destination }
    } else if (node.literal !== null && event.entering && skipType.length === 1 && !subtitleEnd) {
      let words = node.literal.split(' ')
      for (let x = 0; x < words.length; x++) {
        if (words[x].length <= characterLimit) {
          if (words[x] === '\'' || words[x] === '!') {
            subtitle = subtitle.slice(0, -1) + words[x]
          } else {
            subtitle += words[x] + ' '
          }
          characterLimit -= words[x].length
        } else {
          subtitle += '...'
          subtitleEnd = true
          break
        }
      }
    }
  }
  returnObject = { ...returnObject, subtitle: subtitle }
  return returnObject
}

export { processContent }
