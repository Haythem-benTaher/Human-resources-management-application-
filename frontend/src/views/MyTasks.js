import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Input,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { Link, useNavigate } from "react-router-dom";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser._id;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/taches/get");
      const allTasks = response.data;
      const filteredTasks = allTasks.filter((task) => task.candidateId === userId);
      setTasks(filteredTasks);
      console.log("api", allTasks, ",filtered", filteredTasks);
      setLoading(false);
    } catch (error) {
      setError("Error fetching tasks");
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (taskId, completed) => {
    try {
      await axios.put(`http://localhost:5000/taches/update/${taskId}`, {
        status: completed ? "Completed" : "Pending",
      });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error updating task");
    }
  };



  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
                      <h3>My Tasks</h3>
                    </div>
                    <div className="text-right mb-3">
                    
                    </div>
                    {loading && <Spinner color="primary" />}
                    {error && <Alert color="danger">{error}</Alert>}
                    {tasks.length === 0 && !loading && <Alert color="info">No tasks available</Alert>}
                    {tasks.length > 0 && (
                      <ListGroup>
                        {tasks.map((task) => (
                          <ListGroupItem key={task._id}>
                            <Row className="align-items-center">
                              <Col md="1">
                                <Input
                                  type="checkbox"
                                  checked={task.status === "Completed"}
                                  onChange={() =>
                                    handleCheckboxChange(task._id, task.status !== "Completed")
                                  }
                                />
                              </Col>
                              <Col md="7">
                                <span
                                  style={{
                                    textDecoration: task.status === "Completed" ? "line-through" : "none",
                                  }}
                                >
                                  {task.title}
                                </span>
                                <br />
                                <small>User ID: {task.userId}</small>
                                <br />
                              </Col>
                              <Col md="4" className="text-right">
                                <Link to={`/consult-task/${task._id}`}>
                                  <Button
                                    style={{ backgroundColor: "#ADD8E6", borderColor: "#ADD8E6" }}
                                    className="mr-2"
                                  >
                                    Consult
                                  </Button>
                                </Link>
                              </Col>
                            </Row>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    )}
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

export default MyTasks;
