import ventureum from '../variables/ventureum'
import variable from './../variables/platform'

export default (variables = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: ventureum.bold,
    textAlign: 'center',
    '.secondaryColor': {
      color: ventureum.secondaryColor
    }
  }

  return titleTheme
}
