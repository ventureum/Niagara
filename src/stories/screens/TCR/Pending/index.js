import * as React from 'react'
import {
  Content,
  Text,
  List,
  ListItem
} from 'native-base'
import styles from './styles'
export interface Props {
  navigation: any;
  list: any;
}
export interface State {}
class Pending extends React.Component<Props, State> {
  render () {
    return (
      <Content>
        <List>
          {this.props.list &&
            typeof (this.props.list.pendingList) === typeof ([]) &&
            this.props.list.pendingList.map((item, i) => (
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

export default Pending
