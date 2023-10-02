import React, { Component } from 'react'
import {
    Segment,
    Header,
    Button,
  } from "semantic-ui-react";
import { addressFormatter } from '../utils/Formatter';
import Swal from 'sweetalert2';

class Layout extends Component {
    constructor(props) {
      super(props)
      this.state = {
        userAddress: ''
         
      }
    }
    
    async componentDidMount(){
        this.walletConnection();
    }
  walletConnection = async () => {
    if (window.ethereum) {
      try{
        await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((account) => {
            this.setState({userAddress: account[0]});
        })
        .catch((error) => {
          console.error("Error connecting to Metamask:", error);
        });
      } catch(err){
        Swal.fire({
            text: `${err}`,
            icon: "error",
            padding: "3em",
            color: "#716add",
            backdrop: `rgba(0,0,0,0.8)`,
          });
      }
    } else {
      alert("Metamask Not Found");
    }
  };
  render() {
    const {userAddress} = this.state;
    return (
      <div>
        <Segment clearing>
          <Header as="h2" floated="left">
            0x3 Escrow
          </Header>
          <Header as="h2" floated="right">
            {userAddress ? (
              <Button content={addressFormatter(userAddress)} />
            ) : (
              <Button content="connect" onClick={this.walletConnection} />
            )}
          </Header>
        </Segment>

        {this.props.children}
      </div>
    )
  }
}

export default Layout
