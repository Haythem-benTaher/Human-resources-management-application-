import React from "react";
import { Card, CardBody, CardTitle, CardText, Container, Row, Col, Button } from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import Hero from "./IndexSections/Hero.js";
import logo from "../assets/img/brand/elite.jpg"; // Ensure the path is correct

function Index() {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',  // Ensure all cards take full available height
    marginBottom: '20px',
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease-in-out",
    backgroundColor: "#ffffff",
  };

  const cardBodyStyle = {
    flex: '1',  // Allows the card body to grow and fill the height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',  // Ensures space between content and button
    padding: "30px",
  };

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: "#2c3e50",
    marginBottom: '15px',
  };

  const cardTextStyle = {
    flex: '1',
    fontSize: '16px',
    color: "#34495e",
  };

  const handleCardHover = (e, isHover) => {
    e.currentTarget.style.transform = isHover ? "translateY(-8px)" : "translateY(0)";
    e.currentTarget.style.backgroundColor = isHover ? "#f7f7f7" : "#ffffff";
  };

  return (
    <>
      <DemoNavbar />
      <main>
        <Hero />
        <section className="section" style={{ padding: "60px 0", backgroundColor: "#ecf0f1" }}>
          <Container>
            <Row className="mb-5 align-items-center">
              <Col lg="8" className="text-lg-left">
                <h2 className="display-3 text-primary font-weight-bold">
                  Welcome to Elite Council Consulting
                </h2>
                <p className="lead text-muted">
                  We are a leading technology consulting firm specializing in software development, project management, and digital transformation.
                </p>
              </Col>
              <Col lg="4" className="text-lg-right">
                <img src={logo} alt="Elite Council Consulting Logo" style={{ width: "150px", marginBottom: "20px" }} />
              </Col>
            </Row>
          </Container>
        </section>

        <section id="about-section" className="section" style={{ padding: "60px 0", backgroundColor: "#ecf0f1" }}>
          <Container>
            <Row className="mb-5">
              <Col lg="12" className="text-left">
                <h3 className="text-primary">About Our Services</h3>
                <p className="text-muted">
                  We offer a comprehensive range of services to help businesses effectively manage their recruitment processes, including job offer management, application tracking, interview scheduling, and more.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        <section id="offres-section" className="section landing-features" style={{ padding: "60px 0", backgroundColor: "#ecf0f1" }}>
          <Container>
            <Row className="text-left mb-5">
              <Col lg="12">
                <h2 className="display-3 text-primary font-weight-bold">
                  Job Offers
                </h2>
                <p className="lead text-muted">
                  Check out our latest job offers. Click "See more" to explore all available offers.
                </p>
              </Col>
            </Row>
            <Row>
              <Col lg="4">
                <Card style={cardStyle}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                >
                  <CardBody style={cardBodyStyle}>
                    <CardTitle style={cardTitleStyle}>Full Stack Developer</CardTitle>
                    <CardText style={cardTextStyle}>
                      We are looking for an experienced Full Stack Developer to join our team.
                    </CardText>
                    <Button color="primary" href="/create-candidature" className="mt-auto">Apply</Button>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4">
                <Card style={cardStyle}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                >
                  <CardBody style={cardBodyStyle}>
                    <CardTitle style={cardTitleStyle}>IT Project Manager</CardTitle>
                    <CardText style={cardTextStyle}>
                      Join us as an IT Project Manager to manage our software projects.
                    </CardText>
                    <Button color="primary" href="/create-candidature" className="mt-auto">Apply</Button>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4">
                <Card style={cardStyle}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                >
                  <CardBody style={cardBodyStyle}>
                    <CardTitle style={cardTitleStyle}>Digital Transformation Consultant</CardTitle>
                    <CardText style={cardTextStyle}>
                      We are looking for a consultant to help our clients with their digital transformation.
                    </CardText>
                    <Button color="primary" href="/create-candidature" className="mt-auto">Apply</Button>
                  </CardBody>
                </Card>
              </Col>
              
            </Row>
            <Row className="text-center mt-5">
              <Col lg="12">
                <Button color="primary" href="/Offres-page">
                  See More <i className="ni ni-bold-right ml-2" />
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
}

export default Index;
