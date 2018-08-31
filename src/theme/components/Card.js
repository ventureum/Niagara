import variable from './../variables/platform'

export default (variables = variable) => {
  const cardTheme = {
    '.transparent': {
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      shadowRadius: null,
      elevation: null
    },
    marginVertical: 5,
    marginHorizontal: 2,
    flex: 1,
    borderWidth: null,
    borderRadius: 2,
    borderColor: 'white',
    flexWrap: 'wrap',
    backgroundColor: variables.cardDefaultBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.7 },
    shadowOpacity: 0.3,
    shadowRadius: 1.3,
    elevation: 3
  }

  return cardTheme
}
