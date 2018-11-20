import ventureum from '../../../theme/variables/ventureum'

const styles = {
  fill: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
  settingContainer: {
    paddingTop: ventureum.basicPadding * 4,
    paddingBottom: ventureum.basicPadding * 3,
    alignItems: 'stretch',
    paddingHorizontal: ventureum.basicPadding * 2
  },
  settingTitle: {
    color: '#333333',
    fontSize: 18,
    fontWeight: ventureum.medium
  },
  settingText: {
    marginTop: ventureum.basicPadding,
    width: '95%',
    color: '#666666',
    fontSize: 14,
    fontWeight: ventureum.normal
  },
  redeemSettingContainer: {
    marginTop: ventureum.basicPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  redeemSettingText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: ventureum.normal
  },
  spacer: {
    paddingHorizontal: ventureum.basicPadding * 2,
    paddingTop: ventureum.basicPadding * 2,
    paddingBottom: ventureum.basicPadding,
    backgroundColor: '#f8f8f8'
  },
  spacerText: {
    color: '#777777',
    fontSize: 12
  },
  upcomingContainer: {
    flexDirection: 'column',
    paddingHorizontal: ventureum.basicPadding * 2,
    paddingTop: ventureum.basicPadding * 2,
    paddingBottom: ventureum.basicPadding * 2
  },
  transferContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mspText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: ventureum.medium
  },
  timeText: {
    fontSize: 12,
    color: '#777777'
  },
  vtxText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: ventureum.medium
  },
  upcomingFooter: {
    paddingTop: ventureum.basicPadding * 2,
    alignItems: 'flex-end'
  },
  blockInfoTitle: {
    marginTop: ventureum.basicPadding * 2,
    fontSize: 12,
    color: '#777777'
  },
  blockInfoText: {
    marginTop: ventureum.basicPadding,
    fontSize: 14,
    color: '#333333',
    fontWeight: ventureum.medium
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
    borderRadius: ventureum.borderRadiusBase * 3,
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
  assetText: {
    fontSize: ventureum.pageTitleFontSize,
    fontWeight: ventureum.bold,
    color: ventureum.textOnPrimary
  },
  assetSubText: {
    fontSize: ventureum.paragraphFontSize,
    color: '#686868'
  }
}

export default styles
