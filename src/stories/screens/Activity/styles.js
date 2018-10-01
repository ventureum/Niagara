import ventureum from '../../../theme/variables/ventureum'

const styles = {
  listItemContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingVertical: ventureum.basicPadding * 2,
    paddingHorizontal: ventureum.basicPadding * 2
  },
  actionInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItemLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '60%',
    flexWrap: 'wrap'
  },
  listItemRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '20%',
    flexWrap: 'wrap'
  },
  listItemTitle: {
    fontSize: ventureum.listTitleFontSize,
    fontWeight: ventureum.medium,
    color: ventureum.textOnPrimary
  },
  listItemSubTitle: {
    fontSize: ventureum.subTextFontSize,
    color: ventureum.subTextOnPrimary,
    fontWeight: ventureum.light
  },
  date: {
    fontSize: ventureum.subTextFontSize,
    color: ventureum.subTextOnPrimary,
    fontWeight: '200'
  }
}

export default styles
