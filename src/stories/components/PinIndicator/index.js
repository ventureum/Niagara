import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import range from 'lodash/range'
import { Icon } from 'native-base'
import ventureum from '../../../theme/variables/ventureum'

const styles = StyleSheet.create({
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15
  },
  dot: {
    fontSize: 30,
    color: ventureum.lightSecondaryColor,
    paddingHorizontal: ventureum.basicPadding
  }
})

export default class PinIndicator extends Component {
  static propTypes = {
    length: PropTypes.number.isRequired
  };

  render () {
    return (
      <View style={styles.dotsContainer}>
        {range(0, this.props.length).map(n => (
          <Icon name='circle' type='FontAwesome' style={styles.dot} key={n} />
        ))}
        {range(0, 4 - this.props.length).map(n => (
          <Icon name='circle-o' type='FontAwesome' style={styles.dot} key={n} />
        ))}
      </View>
    )
  }
}
