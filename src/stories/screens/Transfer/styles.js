import ventureum from '../../../theme/variables/ventureum'

const styles = {
  content: {
    paddingHorizontal: ventureum.basicPadding
  },
  info: {
    flexDirection: 'column',
    paddingVertical: ventureum.basicPadding,
    alignItems: 'stretch',
    paddingHorizontal: ventureum.basicPadding * 3,
    flex: 1
  },
  nextTransferContainer: {
    flexDirection: 'row',
    paddingVertical: ventureum.basicPadding * 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  assetView: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  assetText: {
    fontSize: ventureum.pageTitleFontSize,
    fontWeight: ventureum.bold,
    color: ventureum.textOnPrimary
  },
  assetSubText: {
    fontSize: ventureum.paragraphFontSize,
    color: '#686868'
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingVertical: ventureum.basicPadding,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  estimationTextContainer: {
    flexDirection: 'row',
    paddingVertical: ventureum.basicPadding,
    width: '80%'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listItemContainer: {
    paddingHorizontal: ventureum.basicPadding,
    paddingVertical: ventureum.basicPadding * 2,
    borderBottomWidth: null,
    borderTopWidth: 1,
    borderColor: ventureum.borderColor
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: ventureum.basicPadding
  },
  switchText: {
    fontSize: ventureum.paragraphFontSize,
    color: ventureum.textOnPrimary,
    fontWeight: ventureum.lessBold
  },
  modalBackground: {
    backgroundColor: 'black',
    opacity: 0.5,
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  modelView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modelMessage: {
    backgroundColor: 'white',
    marginHorizontal: ventureum.basicPadding * 7,
    borderRadius: ventureum.borderRadiusBase,
    padding: ventureum.basicPadding * 3,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  modelHeaderContainer: {
    marginBottom: ventureum.basicPadding
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: ventureum.basicPadding
  },
  detailContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingVertical: ventureum.basicPadding
  },
  firstDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  detailItemTitle: {
    fontSize: ventureum.paragraphFontSize - 1,
    color: ventureum.subTextOnPrimary
  },
  detailItemValue: {
    fontSize: ventureum.paragraphFontSize,
    color: ventureum.textOnPrimary,
    marginVertical: ventureum.basicPadding,
    fontWeight: ventureum.lessBold
  }
}

export default styles
