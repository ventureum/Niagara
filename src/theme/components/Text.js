import variable from './../variables/platform'
import ventureum from '../variables/ventureum'

export default (variables = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    '.note': {
      color: '#a7a7a7',
      fontSize: variables.noteFontSize
    },
    '.secondaryColor': {
      color: ventureum.secondaryColor
    },
    '.onPrimary': {
      color: ventureum.textOnPrimary
    }
  }

  return textTheme
}
