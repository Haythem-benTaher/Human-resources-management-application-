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

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setCurrentUserId(storedUser._id);
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/taches/get");
      
      const tasksWithCandidateNames = await Promise.all(
        response.data.map(async (task) => {
          try {
            const candidate = await fetchUserById(task.candidateId);
            console.log("Candidate fetched:", candidate); // Log candidate data
            const candidateName = candidate?.response?.name || "Unknown Candidate";
            console.log("Candidate Name:", candidateName); // Log candidate name
            return { ...task, candidateName };
          } catch (error) {
            console.error(`Error fetching candidate for task ${task._id}:`, error);
            return { ...task, candidateName: "Error fetching name" }; // Handle individual task error gracefully
          }
        })
      );
  
      setTasks(tasksWithCandidateNames);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error); // Log the overall error
      setError("Error fetching tasks");
      setLoading(false);
    }
  };
  

  const fetchUserById = async (userId) => {
    try {
      const response = await fetch("http://localhost:5000/user/consulter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserID: userId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`Error fetching user data for userId ${userId}:`, error);
      return null;
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

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/taches/delete/${taskId}`);
        fetchTasks(); // Refresh the task list
        setModalContent("Task deleted successfully!");
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error deleting task:", error);
        setError("Error deleting task");
      }
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
                      <h3>Task List</h3>
                    </div>
                    <div className="text-right mb-3">
                      <Button color="primary" onClick={() => navigate("/add-task")}>
                        Add Task
                      </Button>
                    </div>
                    {loading && <Spinner color="primary" />}
                    {error && <Alert color="danger">{error}</Alert>}
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
                              <small>Candidate Name: {task.candidateName}</small>
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
                              {task.userId === currentUserId && (
                                <>
                                  <Link to={`/modify-task/${task._id}`}>
                                    <Button color="info" className="mr-2">
                                      Modify
                                    </Button>
                                  </Link>
                                  <Button color="danger" onClick={() => handleDelete(task._id)}>
                                    Delete
                                  </Button>
                                </>
                              )}
                            </Col>
                          </Row>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SimpleFooter />

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Success</ModalHeader>
        <ModalBody>{modalContent}</ModalBody>
      </Modal>
    </>
  );
};

export default TodoList;
