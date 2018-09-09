import * as React from 'react'
import {
  Content,
  Text,
  List,
  ListItem
} from 'native-base'
import { RefreshControl } from 'react-native'
import WalletUtils from '../../../../utils/wallet'
import styles from './styles'
export interface Props {
  navigation: any;
  list: any;
  loading: String;
}
export interface State { }
class Pending extends React.Component<Props, State> {
  render () {
    return (
      <Content refreshControl={
        <RefreshControl refreshing={this.props.loading}
          onRefresh={this.props.refreshProject}
        />}>
        <List>
          {this.props.list &&
            typeof (this.props.list.pendingList) === typeof ([]) &&
            this.props.list.pendingList.map((item, i) => {
              const txHashAbbr = item.slice(0, 7) + '...' + item.slice(-5)
              return (
                <ListItem
                  key={i}
                  style={{justifyContent: 'space-between'}}
                >
                  <Text>Projet {i + 1}</Text>
                  <Text>{txHashAbbr}</Text>
                </ListItem>
              )
            }
            )}
        </List>
      </Content>
    )
  }
}

export default Pending
