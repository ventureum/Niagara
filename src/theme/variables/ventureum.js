import { Platform } from 'react-native'

const platform = Platform.OS

export default {
  // Primary Color
  darkPrimaryColor: '#696969',
  lightPrimaryColor: '#FFFFFF',
  primaryColor: '#FFFFFF',

  // Secondary Color
  secondaryColor: '#008080',
  lightSecondaryColor: '#4cb0af',
  darkSecondaryColor: '#005354',

  // Unclickable
  unClickable: '#808080',

  // Text Color
  textOnPrimary: '#000000',
  subTextOnPrimary: '#323232',
  textOnSecondary: '#ffffff',

  // Border Color
  borderColor: '#878787',

  // Font Size
  pageTitleFontSize: 20,
  paragraphFontSize: 14,
  listTitleFontSize: 14,
  componentTitleFontSize: 16,
  buttonFontSize: 14,
  textInputFontSize: 16,

  // Font Weight
  light: '300',
  normal: '400',
  medium: '500',
  lessBold: '600',
  bold: '700',

  // Font Family
  Fontfamily: platform === 'ios' ? 'Roboto' : 'Roboto_medium',

  // Spacing
  statusBarSpacing: 15,
  basicPadding: 8,

  // Border Radius:
  borderRadiusBase: platform === 'ios' ? 6 : 3,

  // Shawdow
  applyShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2
  }
}