import React, { Component } from "react";
import { factoryAbi, factoryAddress } from "../Factory";
import {
  Form,
  Input,
  Button,
  Grid,
  Container,
  Card,
  Image,
  Segment,
  Header,
  Message,
} from "semantic-ui-react";
import { ethers } from "ethers";
import { etherConnection } from "../EtherProvider";
import Swal from "sweetalert2";
import { Abi } from "../contractDetails";
import { Link } from "react-router-dom";
import Layout from "./Layout";
// 0x86167aaE5eF2A65e0aD23A3171e3aa172b94F462
// 0xfB0E7A0474C31eA280B8Efd6B5872669049C89f1
const contractAddress = "0x2C5495739cAE8e35Cd4426C9Bf4c6a4B80df3A42";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      signer: null,
      userAddress: "",
      arbiterAdd: null,
      beneficiaryAdd: null,
      amount: null,
      loading: false,
      message: "",
      currentArbiter: "",
      currentBeneficiary: "",
      loadingA: false,
      escrowAddress: []
    };
  }

async componentDidMount() {
  const {userAddress, provider, signer, escrowAddress} = await etherConnection();
  this.setState({ provider, signer, userAddress, escrowAddress });
  this.onGoingEscrows();
  }


  onGoingEscrows = async () => {
    const { signer } = this.state;
    try {
      const instance = new ethers.Contract(contractAddress, Abi, signer);
      const currentArbiter = await instance.arbiter();
      const currentBeneficiary = await instance.beneficiary();

      this.setState({ currentArbiter, currentBeneficiary });
    } catch (err) {
      console.log(err);
    }
  };

  
  formHandler = async (e) => {
    e.preventDefault();
    const { signer, arbiterAdd, beneficiaryAdd, provider } = this.state;
    try {
      this.setState({
        message: (
          <Message info>
            <Message.Header>Escrow contract creation processing</Message.Header>
            <p>Please confirm transaction in your wallet</p>
          </Message>
        ),
      });
      this.setState({ loading: true });

      const factoryInstance = new ethers.Contract(factoryAddress, factoryAbi, provider);
      await factoryInstance.connect(signer).createEscrow(arbiterAdd, beneficiaryAdd);
      
      this.setState({ loading: false });
      this.setState({
        message: (
          <Message info>
            <Message.Header>
              Escrow contract created successfully
            </Message.Header>
            <p>Happy trading!!!</p>
          </Message>
        ),
      });
    } catch (err) {
      Swal.fire({
        text: `${err.Error}`,
        icon: "error",
        padding: "3em",
        color: "#716add",
        backdrop: `rgba(0,0,0,0.8)`,
      });
      this.setState({ loading: false });
      this.setState({
        message: (
          <Message warning>
            <Message.Header>
              Errow while creating escrow contract
            </Message.Header>
            <p>Please check and try again</p>
          </Message>
        ),
      });
    }
  };

  render() {
    const {
      userAddress,
      arbiterAdd,
      beneficiaryAdd,
      amount,
      loading,
      message,
      currentArbiter,
      currentBeneficiary,
      loadingA,
      escrowAddress
    } = this.state;
    return (
      <Container>
       <Layout>
         
       <h2>Welcome To 0x3 Escrow</h2>
        {message ? message : ""}
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Form onSubmit={this.formHandler}>
                <Form.Field>
                  <label>Arbiter</label>
                  <Input
                    value={arbiterAdd}
                    onChange={(e) =>
                      this.setState({ arbiterAdd: e.target.value })
                    }
                  />
                </Form.Field>

                <Form.Field>
                  <label>Beneficiary</label>
                  <Input
                    value={beneficiaryAdd}
                    onChange={(e) =>
                      this.setState({ beneficiaryAdd: e.target.value })
                    }
                  />
                </Form.Field>
              
                <Button
                  primary
                  content="Create!!"
                  type="submit"
                  loading={loading}
                />
              </Form>
            </Grid.Column>

            <Grid.Column width={8} fluid>
              <Container
                style={{ justifyContent: "center", marginLeft: "100px" }}


              >

        {escrowAddress ? escrowAddress.map((address) =>  <Card.Group>
                  <Card>
                    <h2>Ongoing Transactions</h2>



                    <Card.Content >
                      <Image
                        floated="right"
                        size="mini"
                        src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                      />
                      <Card.Header>
                        Contract: {address}
                      </Card.Header>
                      <Card.Description>
                        Only the <strong>Arbiter</strong> can approve this
                        transaction
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="ui two buttons">
                        <Link to={`/${address}`}>
                        <Button basic color="green">
                          View Transaction
                        </Button>
                        </Link>
                      </div>
                    </Card.Content>
                  </Card>
                </Card.Group>) : 'Error'}

               
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>

       </Layout>
      </Container>
    );
  }
}

export default Home;
