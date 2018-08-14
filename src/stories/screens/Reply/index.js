import React, { Component } from 'react'
import { Text, Icon, Toast, Container, Header, Left, Right, Body, Title, Button } from 'native-base'
import { TextInput, View, KeyboardAvoidingView, ScrollView, Switch } from 'react-native'
import styles from './styles'
import { processContent } from '../../../utils/content'
export default class Reply extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      text: null,
      onChain: false
    })
  }

  onSendComment = (parentPost, text) => {
    if (this.state.text !== null) {
      const content = processContent('', text)
      if (content === false) {
        Toast.show({
          text: 'Invalid text detected',
          position: 'center',
          buttonText: 'Okay',
          type: 'danger',
          duration: 10000
        })
        return
      }
      let destination
      if (this.state.onChain) {
        destination = 'ON-CHAIN'
      } else {
        destination = 'OFF-CHAIN'
      }
      const boardId = this.props.boardHash
      const parentHash = parentPost.postHash
      const postType = 'COMMENT'
      this.props.newPost(content, boardId, parentHash, postType, destination)
      this.props.navigation.goBack()
    }
  }

  render () {
    const { post } = this.props

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Title>{this.state.onChain ? 'On-chain ' : 'Off-chain '}</Title>
            <Switch
              value={this.state.onChain}
              onValueChange={(value) => {
                this.setState({ onChain: value })
              }}
              style={{ marginRight: 3 }}
            />
          </Body>
          <Right>
            <Button
              style={{ height: '70%' }}
              info
              rounded
              onPress={() => {
                this.onSendComment(post, this.state.text)
              }}
            >
              <Text>POST</Text>
            </Button>
          </Right>
        </Header>
        <KeyboardAvoidingView style={styles.content}>
          <ScrollView>
            <View style={styles.postTitle}>
              <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>{post.content.title}</Text>
            </View>
            <View>
              <TextInput
                autoFocus
                placeholder='Share your ideas!'
                multiline
                underlineColorAndroid='transparent'
                onChangeText={(text) => {
                  this.setState({ text })
                }}
                value={this.state.text}
                selectionColor='red'
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
