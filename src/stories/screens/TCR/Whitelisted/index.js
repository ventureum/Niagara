import * as React from 'react'
import {
  Content,
  Text,
  List,
  ListItem
} from 'native-base'
import styles from './styles'
import { RefreshControl } from 'react-native'
export interface Props {
  navigation: any;
  list: any;
  loading: String;
}
export interface State { }
class Whitelisted extends React.Component<Props, State> {
  render () {
    return (
      <Content refreshControl={
        <RefreshControl refreshing={this.props.loading}
          onRefresh={this.props.refreshProject}
        />}>
        <List style={styles.list}>
          {this.props.list &&
            typeof (this.props.list.whitelistList) === typeof ([]) &&
            this.props.list.whitelistList.map((item, i) => {
              const txHashAbbr = item.slice(0, 7) + '...' + item.slice(-5)
              return (
                <ListItem
                  key={i}
                  style={{justifyContent: 'space-between'}}
                >
                  <Text>Project Hash: </Text>
                  <Text>{txHashAbbr}</Text>
                </ListItem>
              )
            })}
        </List>
      </Content>
    )
  }
}

export default Whitelisted
