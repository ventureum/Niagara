import { Platform, StyleSheet } from 'react-native'

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

  // Other Color
  errorColor: '#f93b3b',
  lightErrorColor: '#ff6d6d',

  // Unclickable
  unClickable: '#808080',

  // Text Color
  textOnPrimary: '#000000',
  subTextOnPrimary: '#a7a7a7',
  textOnSecondary: '#ffffff',

  // Border
  borderColor: '#878787',
  borderWidth: StyleSheet.hairlineWidth,

  // Font Size
  pageTitleFontSize: 20,
  componentTitleFontSizeBig: 18,
  paragraphFontSize: 14,
  listTitleFontSize: 14,
  componentTitleFontSize: 16,
  buttonFontSize: 14,
  textInputFontSize: 16,
  subTextFontSize: 12,

  // Font Weight
  light: '300',
  normal: '400',
  medium: '500',
  lessBold: '600',
  bold: '700',

  // Font Family
  Fontfamily: platform === 'Roboto',

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
