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
export interface State {}
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
            this.props.list.whitelistList.map((item, i) => (
              <ListItem
                key={i}
              >
                <Text>{item}</Text>
              </ListItem>
            ))}
        </List>
      </Content>
    )
  }
}

export default Whitelisted
