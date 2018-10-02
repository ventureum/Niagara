import variable from './../variables/platform'
import ventureum from '../variables/ventureum'

export default (variables = variable) => {
  const thumbnailTheme = {
    '.square': {
      borderRadius: ventureum.borderRadiusBase * 2,
      '.small': {
        width: 36,
        height: 36,
        borderRadius: ventureum.borderRadiusBase
      },
      '.large': {
        width: 80,
        height: 80,
        borderRadius: 0
      }
    },
    '.small': {
      width: 36,
      height: 36,
      borderRadius: 18,
      '.square': {
        borderRadius: 0
      }
    },
    '.large': {
      width: 80,
      height: 80,
      borderRadius: 40,
      '.square': {
        borderRadius: 0
      }
    },
    width: 56,
    height: 56,
    borderRadius: 28
  }

  return thumbnailTheme
}
