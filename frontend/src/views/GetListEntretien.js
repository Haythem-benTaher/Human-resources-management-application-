import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

const GetListEntretien = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Display multiple interviews per page
  const [interviews, setInterviews] = useState([]); // Initialize as an empty array
  const [userId, setUserId] = useState(null); // State for userId
  const mainRef = useRef(null);

  useEffect(() => {
    // Retrieve the userId from session/localStorage/context
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser ? storedUser._id : null; // Example of fetching from localStorage
    setUserId(userId);

    if (userId) {
      fetch(`http://localhost:5000/entretiens/get`)
        .then((response) => response.json())
        .then((data) => {
          // Filter interviews based on candidateId
          const interviewList = data
            .filter((entretien) => entretien.candidateId === userId)
            .map((entretien) => ({
              id: entretien._id,
              date: entretien.date,
              titre: entretien.title,
              status: entretien.status,
              justification: entretien.justification || "",
              location: entretien.location || "",
              editingJustification: false,
              newJustification: ""
            }));

          setInterviews(interviewList);
        })
        .catch((error) => {
          console.error("Error fetching interviews:", error);
        });
    }
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAccept = (interviewId) => {
    fetch(`http://localhost:5000/entretiens/update/${interviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "Accepted"
      })
    })
      .then((response) => response.json())
      .then((updatedInterview) => {
        setInterviews((prevInterviews) =>
          prevInterviews.map((interview) =>
            interview.id === interviewId
              ? { ...interview, status: updatedInterview.status }
              : interview
          )
        );
      })
      .catch((error) => {
        console.error("Error accepting interview:", error);
      });
  };

  const handleDecline = (interviewId) => {
    setInterviews((prevInterviews) =>
      prevInterviews.map((interview) =>
        interview.id === interviewId
          ? { ...interview, editingJustification: true }
          : interview
      )
    );
  };

  const handleJustificationChange = (interviewId, newJustification) => {
    setInterviews((prevInterviews) =>
      prevInterviews.map((interview) =>
        interview.id === interviewId
          ? { ...interview, newJustification }
          : interview
      )
    );
  };

  const handleSaveJustification = (interviewId) => {
    const interview = interviews.find((i) => i.id === interviewId);
    fetch(`http://localhost:5000/entretiens/update/${interviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "Rejected",
        justification: interview.newJustification
      })
    })
      .then((response) => response.json())
      .then((updatedInterview) => {
        setInterviews((prevInterviews) =>
          prevInterviews.map((i) =>
            i.id === interviewId
              ? {
                  ...i,
                  status: updatedInterview.status,
                  justification: updatedInterview.justification,
                  editingJustification: false
                }
              : i
          )
        );
      })
      .catch((error) => {
        console.error("Error declining interview:", error);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = interviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(interviews.length / itemsPerPage);

  return (
    <>
      <DemoNavbar />
      <main className="profile-page" ref={mainRef}>
        <section className="section-profile-cover section-shaped my-0">
          <div className="shape shape-style-1 shape-default alpha-4"></div>
        </section>
        <section className="section">
          <Container>
            <Card className="card-profile shadow custom-margin">
              <div className="px-4">
                <center>
                  <br></br>
                <h2>my interviews</h2></center>
                <Row className="justify-content-center">
                  <Col className="order-lg-1" lg="10">
                    <Container className="mt-5">
                    {currentItems.length === 0 ? (
                        <Col className="text-center">
                          <p>No interviews available.</p>
                        </Col>
                      ) : (
                      <Row className="justify-content-center">
                        {currentItems.map((interview) => (
                          <Col lg="6" key={interview.id}>
                            <Card className="mb-4 shadow-sm" style={{ borderRadius: "10px" }}>
                              <div className="card-body">
                                <h5 className="card-title">{interview.titre}</h5>
                                <p className="card-text">
                                  <strong>Date & Time:</strong>{" "}
                                  {new Date(interview.date).toLocaleString()}
                                </p>
                                <p className="card-text">
                                  <strong>Location:</strong> {interview.location}
                                </p>
                                <p className="card-text">
                                  <strong>Status:</strong>{" "}
                                  <span
                                    className={`badge ${
                                      interview.status === "Accepted"
                                        ? "bg-success"
                                        : interview.status === "Rejected"
                                        ? "bg-danger"
                                        : "bg-warning"
                                    }`}
                                  >
                                    {interview.status}
                                  </span>
                                </p>
                                {interview.status === "Pending" &&
                                  !interview.editingJustification && (
                                    <div className="d-flex justify-content-between">
                                      <Button
                                        color="success"
                                        onClick={() => handleAccept(interview.id)}
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        color="danger"
                                        onClick={() => handleDecline(interview.id)}
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  )}
                                {interview.editingJustification && (
                                  <div>
                                    <Input
                                      type="textarea"
                                      placeholder="Write justification..."
                                      value={interview.newJustification}
                                      onChange={(e) =>
                                        handleJustificationChange(
                                          interview.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Button
                                      color="primary"
                                      onClick={() =>
                                        handleSaveJustification(interview.id)
                                      }
                                      className="mt-2"
                                    >
                                      Save Justification
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      )}
                      {/* Pagination Controls */}
                      <Row className="justify-content-center mt-4">
                        <Col lg="8">
                          <Pagination className="justify-content-center">
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink
                                previous
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(currentPage - 1);
                                }}
                              />
                            </PaginationItem>
                            {[...Array(totalPages).keys()].map(
                              (pageNumber) => (
                                <PaginationItem
                                  key={pageNumber + 1}
                                  active={pageNumber + 1 === currentPage}
                                >
                                  <PaginationLink
                                    href="#pablo"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handlePageChange(pageNumber + 1);
                                    }}
                                  >
                                    {pageNumber + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              )
                            )}
                            <PaginationItem disabled={currentPage === totalPages}>
                              <PaginationLink
                                next
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(currentPage + 1);
                                }}
                              />
                            </PaginationItem>
                          </Pagination>
                        </Col>
                      </Row>
                    </Container>
                  </Col>
                </Row>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default GetListEntretien;
