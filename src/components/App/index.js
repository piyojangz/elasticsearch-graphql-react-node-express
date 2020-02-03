import React, { Component } from "react";
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import * as _ from "lodash";
import socketIOClient from 'socket.io-client'

const PEOPLE = gql`{
  people {
    functionname
    func
    empid
  }
}`;

export class App extends Component {

  constructor() {
    super()

    this.state = {
      input: '',
      message: undefined,
      time:undefined,
      endpoint: "http://localhost:3000" // เชื่อมต่อไปยัง url ของ realtime server
    }
  }

  componentDidMount = () => {
    this.response()
  }


  // เมื่อมีการส่งข้อมูลไปยัง server
  // send = (message) => {
  //   const { endpoint, input } = this.state
  //   const socket = socketIOClient(endpoint)
  //   socket.emit('sent-message', input)
  //   this.setState({ input: '' })
  // }

  // รอรับข้อมูลเมื่อ server มีการ update
  response = () => {
    const { endpoint, message } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    socket.on('new-message', (messageNew) => {
      this.setState({ message: messageNew.rs,time :messageNew.time  })
    })
  }

  render() {
    console.log(this.state.message)
    let func = '';
    if (this.state.message != undefined) {
      func = this.state.message.data.people[0].functionname;
    }
    return (
      <div>
        <h1>({this.state.time}) {func} </h1>
      </div>
    );
  }
}