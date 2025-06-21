import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

class SimpleFooter extends React.Component {
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    return (
      <>
        <footer id="footer" className="footer">
          <Container>
            <Row className="row-grid align-items-center mb-5">
              <Col lg="6">
                <h3 className="text-primary font-weight-light mb-2">
                  Thank you for supporting us!
                </h3>
                <h4 className="mb-0 font-weight-light">
                  Let's connect on this platform.
                </h4>
              </Col>
              <Col lg="6" className="text-lg-right btn-wrapper">
                <Button
                  className="btn-icon-only rounded-circle ml-1"
                  color="twitter"
                  href="https://twitter.com"
                  id="tooltip475038074"
                  target="_blank"
                >
                  <i className="fa fa-twitter" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip475038074">
                  Follow us on Twitter
                </UncontrolledTooltip>
                <Button
                  className="btn-icon-only rounded-circle ml-1"
                  color="facebook"
                  href="https://facebook.com"
                  id="tooltip837440414"
                  target="_blank"
                >
                  <i className="fa fa-facebook" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip837440414">
                  Like us on Facebook
                </UncontrolledTooltip>
                <Button
                  className="btn-icon-only rounded-circle ml-1"
                  color="instagram"
                  href="https://instagram.com"
                  id="tooltip829810202"
                  target="_blank"
                >
                  <i className="fa fa-instagram" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip829810202">
                  Follow us on Instagram
                </UncontrolledTooltip>
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center justify-content-md-between">
              <Col md="6">
                <div className="copyright">
                  © {new Date().getFullYear()}{" "}
                  <a
                    href="https://www.creative-tim.com?ref=adsr-footer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Creative Tim
                  </a>
                  .
                </div>
              </Col>
              <Col md="6" className="text-md-right">
                <Nav className="justify-content-md-end">
                  <NavItem>
                    <NavLink
                      to="/contact"
                      tag={Link}
                      className="text-primary"
                    >
                      Contact Us
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="contact-info">
                  <p className="mb-0">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p className="mb-0">
                    <strong>Email:</strong> contact@example.com
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
          <button className="scroll-to-top" onClick={this.scrollToTop}>
            <i className="fa fa-arrow-up" />
          </button>
        </footer>
      </>
    );
  }
}

export default SimpleFooter;
