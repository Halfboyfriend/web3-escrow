import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { addressFormatter } from "../utils/Formatter";
import {
  Button,
  Container,
  Form,
  Input,
  Message,
  Card,
  Image,
  Grid,
  Segment,
  Divider,
} from "semantic-ui-react";
import { Abi } from "../contractDetails";
import { ethers } from "ethers";
import { etherConnection } from "../EtherProvider";
import Swal from "sweetalert2";
function ViewTransaction() {
  const params = useParams();
  const contract = params.contract;
  const [amount, setAmount] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingApp, setLoadingApp] = useState(false);
  const [arbiter, setArbiter] = useState(null);
  const [beneficiary, setBeneficiary] = useState(null);
  const [completed, setCompletd] = useState(false);

  async function transactAmount(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg(
        <Message info>
          <Message.Header>Depositor making payment</Message.Header>
          <p>Please confirm transaction in your wallet</p>
        </Message>
      );
      const { signer } = await etherConnection();
      const Escrow = new ethers.Contract(contract, Abi, signer);
      const value = ethers.utils.parseEther(amount);
      await Escrow.connect(signer).makePayment({ value: value });

      setLoading(false);
      setMsg(
        <Message info>
          <Message.Header>Your transaction was completed</Message.Header>
          <p>Please contact the arbiter for approval</p>
        </Message>
      );
    } catch (err) {
      Swal.fire({
        text: `${err}`,
        icon: "error",
        padding: "3em",
        color: "#716add",
        backdrop: `rgba(0,0,0,0.8)`,
      });

      setLoading(false);
      setMsg(
        <Message info>
          <Message.Header>Error while making payment</Message.Header>
          <p>Please check and try again</p>
        </Message>
      );
    }
  }

  async function approveTransaction() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      setLoadingApp(true);
      setMsg(
        <Message info>
          <Message.Header>Arbiter Approving transaction</Message.Header>
          <p>Please confirm transaction in your wallet</p>
        </Message>
      );
      const Escrow = new ethers.Contract(contract, Abi, signer);
      await Escrow.connect(signer).approve();
      setMsg(
        <Message info>
          <Message.Header>Transaction approved successfully</Message.Header>
          <p>Happy trading</p>
        </Message>
      );
      setLoadingApp(false);
    } catch (err) {
      Swal.fire({
        text: `${err}`,
        icon: "error",
        padding: "3em",
        color: "#716add",
        backdrop: `rgba(0,0,0,0.8)`,
      });
      setLoadingApp(false);
      setMsg(
        <Message warning>
          <Message.Header>Errow while Approving transaction</Message.Header>
          <p>Please check and try again</p>
        </Message>
      );
    }
  }
  async function details() {
    try {
      const { signer } = await etherConnection();
      const Escrow = new ethers.Contract(contract, Abi, signer);
      const arb = await Escrow.arbiter();
      const bene = await Escrow.beneficiary();
      const approval = await Escrow.isApproved();
      setCompletd(approval);
      setArbiter(arb);
      setBeneficiary(bene);
    } catch (err) {
      Swal.fire({
        text: `${err}`,
        icon: "error",
        padding: "3em",
        color: "#716add",
        backdrop: `rgba(0,0,0,0.8)`,
      });
    }
  }

  useEffect(() => {
    details();
  }, []);

  return (
    <Container>
      <Layout>
        <h2>Transaction of this contract {contract} </h2>
        {msg ? msg : ""}

        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column>
              <Form onSubmit={transactAmount}>
                <Form.Field>
                  <label>Amount (ether)</label>
                  <Input
                    label="ether"
                    value={amount}
                    labelPosition="rigth"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Field>

                <Button content="submit" primary loading={loading} />
              </Form>
            </Grid.Column>

            <Grid.Column verticalAlign="middle">
              <Card>
                <Card.Content>
                  <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                  />
                  <Card.Header>Arbiter</Card.Header>
                  <Card.Meta>{addressFormatter(arbiter)}</Card.Meta>
                  <Card.Description>
                    Only the <strong>Arbiter</strong> can approve this
                    transaction.
                  </Card.Description>
                  <p>Beneficiary: {addressFormatter(beneficiary)} </p>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    {completed ? (
                      <Button color="red" />
                    ) : (
                      <Button
                        basic
                        color="green"
                        onClick={approveTransaction}
                        loading={loadingApp}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>

          <Divider vertical>Or</Divider>
        </Segment>
      </Layout>
    </Container>
  );
}

export default ViewTransaction;
