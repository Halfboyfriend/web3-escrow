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
  Message,
  Dimmer,
} from "semantic-ui-react";
import { ethers } from "ethers";
import { etherConnection } from "../EtherProvider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { addressFormatter } from "../utils/Formatter";

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
      escrowAddress: [],
    };
  }

  async componentDidMount() {
    const { userAddress, provider, signer, escrowAddress } =
      await etherConnection();
    this.setState({ provider, signer, userAddress, escrowAddress });
    this.onGoingEscrows();
  }

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

      const factoryInstance = new ethers.Contract(
        factoryAddress,
        factoryAbi,
        provider
      );
      await factoryInstance
        .connect(signer)
        .createEscrow(arbiterAdd, beneficiaryAdd);

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
      arbiterAdd,
      beneficiaryAdd,

      loading,
      message,

      escrowAddress,
    } = this.state;
    return (
      <Container>
        <Layout>
          <h2>Welcome To 0x3 Escrow Sapolia</h2>
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
                  {escrowAddress ? (
                    escrowAddress.map((address) => (
                      <Card.Group>
                        <Card>
                          <Card.Content>
                            <Image
                              floated="right"
                              size="mini"
                              src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                            />
                            <Card.Header>
                              Contract: {addressFormatter(address)}
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
                      </Card.Group>
                    ))
                  ) : (
                    <Dimmer.Dimmable as={Segment} dimmed={true}>
                      <p>
                        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                      </p>
                      <p>
                        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                      </p>

                      <Dimmer
                        active={false}
                        onClickOutside={true}
                        verticalAlign="bottom"
                      >
                      </Dimmer>
                    </Dimmer.Dimmable>
                  )}
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
