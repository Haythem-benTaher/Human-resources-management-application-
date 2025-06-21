import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { useParams, useNavigate } from "react-router-dom";

const ConsultTask = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/taches/get/${id}`);
      setTask(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching task details');
      setLoading(false);
    }
  };

  if (loading) return <Spinner color="primary" />;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <>
      <DemoNavbar />
      <main className="profile-page">
        <section className="section-profile-cover section-shaped my-0">
          <div className="shape shape-style-1 shape-default alpha-4"></div>
        </section>
        <section className="section">
          <Container>
            <Card className="card-profile shadow custom-margin">
              <div className="px-4">
                <Row className="justify-content-center">
                  <Col lg="12">
                    <div className="text-center mt-5">
                      <h3>Task Details</h3>
                    </div>
                    <div className="mt-5 py-5 border-top text-center">
                      <Row className="justify-content-center">
                        <Col lg="8">
                          <div className="text-left">
                            <h4>Title: {task.title}</h4>
                            <p><strong>Description:</strong> {task.description}</p>
                            <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(task.endDate).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                     
                          
                          </div>
                          <div className="text-center mt-4">
                          <Button
                            color="primary"
                            onClick={() => {
                              const storedUser = JSON.parse(localStorage.getItem("user"));

                              if (storedUser.role === "admin") {
                                navigate('/list-task');
                              } else {
                                navigate('/mytask');
                              }
                            }}
                          >
                            Back to Task List
                          </Button>

                          </div>
                        </Col>
                      </Row>
                    </div>
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

export default ConsultTask;
