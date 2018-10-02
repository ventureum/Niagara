import ventureum from '../../../theme/variables/ventureum'

const styles = {
  header: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: ventureum.basicPadding * 2,
    paddingLeft: ventureum.basicPadding * 4,
    paddingRight: ventureum.basicPadding * 4,
    paddingBottom: ventureum.basicPadding,
    flex: 1
  },
  nameAndAvatar: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: ventureum.basicPadding
  },
  name: {
    paddingTop: ventureum.basicPadding,
    fontSize: ventureum.componentTitleFontSizeBig,
    fontWeight: ventureum.normal
  },
  lvBadge: {
    marginTop: ventureum.basicPadding,
    backgroundColor: ventureum.lightSecondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: ventureum.basicPadding - 4,
    borderRadius: ventureum.borderRadiusBase
  },
  lvText: {
    color: ventureum.textOnSecondary,
    fontSize: ventureum.buttonFontSize,
    fontWeight: ventureum.normal
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ventureum.basicPadding
  },
  milestoneInfoContainer: {
    flexDirection: 'column',
    paddingTop: ventureum.basicPadding,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  milestonePoints: {
    fontSize: ventureum.pageTitleFontSize,
    fontWeight: ventureum.bold
  },
  milestoneText: {
    fontSize: ventureum.componentTitleFontSize,
    color: ventureum.subTextOnPrimary
  },
  vtxInfo: {
    flexDirection: 'column',
    paddingTop: ventureum.basicPadding,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  vtxPoints: {
    fontSize: ventureum.pageTitleFontSize,
    fontWeight: ventureum.bold
  },
  vtxText: {
    fontSize: ventureum.componentTitleFontSize,
    color: ventureum.subTextOnPrimary
  },
  activityItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }
}

export default styles

/*
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 13,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#cecece'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  nameCardContainer: {
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  nameCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  paddingSpace: {
    height: 4,
    backgroundColor: '#dbdcdd'
  },
  reputationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  userInfoContainer: {
    paddingHorizontal: ventureum.basicPadding * 3,
    paddingVertical: ventureum.basicPadding,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'absolute',
    top: 60
  },
  nameAndAvatar: {
    flexDirection: 'row',
    paddingVertical: ventureum.basicPadding,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  nameContainer: {
    flexDirection: 'column',
    paddingTop: ventureum.basicPadding - 4,
    paddingLeft: ventureum.basicPadding * 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  milestoneInfoContainer: {
    flexDirection: 'column',
    paddingTop: ventureum.basicPadding,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  milestonePoints: {
    fontSize: ventureum.pageTitleFontSize,
    fontWeight: ventureum.bold
  },
  milestoneText: {
    fontSize: ventureum.componentTitleFontSize,
    color: ventureum.subTextOnPrimary
  },
  name: {
    fontSize: ventureum.pageTitleFontSize,
    fontWeight: ventureum.lessBold
  },
  lvBadge: {
    backgroundColor: ventureum.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: ventureum.basicPadding - 4,
    borderRadius: ventureum.borderRadiusBase
  },
  lvText: {
    color: ventureum.textOnSecondary,
    fontSize: ventureum.buttonFontSize,
    fontWeight: ventureum.normal
  }
*/
