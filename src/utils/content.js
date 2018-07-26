import { markdown } from 'markdown'

function findFirstImageURL (text) {
  let tree = markdown.parse(text)
  return _findFirstImageURL(tree)
}

function _findFirstImageURL (tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      // base case:
      if (tree[i] === 'img' && tree.length === 2 && i === 0) {
        return tree[1].href
      }
      let found = _findFirstImageURL(tree[i])
      if (found !== false) {
        return found
      }
    }
  }
  if (typeof tree === 'object') {
    for (let key in tree) {
      let found = _findFirstImageURL(tree[key])
      if (found !== false) {
        return found
      }
    }
  }
  return false
}

function getSubtitle (text) {
  let tree = markdown.parse(text)
  let characterLimit = 150
  let subtitle = ''
  for (let i = 0; i < tree.length && characterLimit > 0; i++) {
    if (tree[i][0] === 'para') {
      for (let j = 1; j < tree[i].length && characterLimit > 0; j++) {
        if (typeof tree[i][j] === 'string') {
          let words = tree[i][j].split(' ')
          for (let x = 0; x < words.length; x++) {
            if (words[x].length <= characterLimit) {
              subtitle += words[x] + ' '
              characterLimit -= words[x].length
            } else {
              subtitle += '...'
              return subtitle
            }
          }
        }
      }
    }
  }
  return subtitle
}

export { findFirstImageURL, getSubtitle }
