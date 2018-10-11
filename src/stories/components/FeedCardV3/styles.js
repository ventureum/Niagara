import ventureum from '../../../theme/variables/ventureum'

const styles = {
  card: {
    marginHorizontal: ventureum.basicPadding * 2,
    marginVertical: ventureum.basicPadding,
    flex: 1,
    flexWrap: 'wrap',
    borderTopWidth: 8,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 5,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3
  },
  top: {
    flexDirection: 'column',
    alignItems: 'stretch',
    borderBottomWidth: ventureum.borderWidth,
    borderBottomColor: '#f0f0f5',
    paddingBottom: ventureum.basicPadding,
    paddingLeft: ventureum.basicPadding,
    marginTop: ventureum.basicPadding
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: ventureum.basicPadding,
    paddingVertical: ventureum.basicPadding,
    marginTop: ventureum.basicPadding
  },
  userNameText: {
    color: ventureum.textOnPrimary,
    fontSize: ventureum.paragraphFontSize,
    fontWeight: ventureum.lessBold
  },
  timeText: {
    color: ventureum.subTextOnPrimary,
    fontSize: ventureum.subTextFontSize,
    fontWeight: ventureum.normal
  },
  titleText: {
    color: ventureum.textOnPrimary,
    fontSize: ventureum.componentTitleFontSize,
    fontWeight: ventureum.lessBold,
    marginBottom: ventureum.basicPadding
  },
  subtitleText: {
    color: ventureum.subTextOnPrimary,
    fontSize: ventureum.paragraphFontSize,
    fontWeight: ventureum.normal,
    marginBottom: ventureum.basicPadding
  },
  iconStyle: {
    fontSize: 18,
    color: ventureum.defaultIconColor,
    marginLeft: ventureum.basicPadding * 3
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: ventureum.basicPadding,
    marginRight: ventureum.basicPadding
  },
  iconText: {
    fontSize: 14,
    color: ventureum.subTextOnPrimary,
    marginLeft: ventureum.basicPadding,
    fontWeight: ventureum.medium
  }
}

export default styles
