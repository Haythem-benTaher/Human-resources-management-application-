import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Button,
  Card,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Validation schema with Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
  endDate: Yup.date()
    .required('End date is required')
    .typeError('Invalid date')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  status: Yup.string().required('Status is required'),
});

const ModifyTaskForm = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const navigate = useNavigate(); // To navigate back to the task list
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for modal visibility
  const mainRef = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/taches/get/${id}`);
        const taskData = response.data;

        // Format the dates to 'yyyy-MM-dd' format
        if (taskData.startDate) {
          taskData.startDate = new Date(taskData.startDate).toISOString().split('T')[0];
        }
        if (taskData.endDate) {
          taskData.endDate = new Date(taskData.endDate).toISOString().split('T')[0];
        }

        reset(taskData); // Reset the form with fetched data
        setLoading(false);
      } catch (error) {
        setError('Error fetching task details');
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, reset]);

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/taches/update/${id}`, data);
      setSuccess('Task updated successfully');
      toggleSuccessModal(); // Open the success modal
      setTimeout(() => {
        navigate('/list-task'); // Redirect to the task list after 2 seconds
      }, 2000); // Adjust the delay to ensure the modal is visible
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error updating task');
    }
  };

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
                <Row className="justify-content-center">
                  <Col className="order-lg-1" lg="4"></Col>
                </Row>
                <div className="text-center mt-5">
                  <h3>Modify Task</h3>
                </div>
                {loading && <Spinner color="primary" />}
                {error && <Alert color="danger">{error}</Alert>}
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Title
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="title"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Title" type="text" />
                                  )}
                                />
                              </InputGroup>
                              {errors.title && <p className="text-danger">{errors.title.message}</p>}
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Description
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="description"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Description" type="textarea" />
                                  )}
                                />
                              </InputGroup>
                              {errors.description && <p className="text-danger">{errors.description.message}</p>}
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Start Date
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="startDate"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Start Date" type="date" />
                                  )}
                                />
                              </InputGroup>
                              {errors.startDate && <p className="text-danger">{errors.startDate.message}</p>}
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              End Date
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="endDate"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="End Date" type="date" />
                                  )}
                                />
                              </InputGroup>
                              {errors.endDate && <p className="text-danger">{errors.endDate.message}</p>}
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Status
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="status"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Status" type="select">
                                      <option value="">Select a status</option>
                                      <option value="In progress">In progress</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Pending">Pending</option>
                                    </Input>
                                  )}
                                />
                              </InputGroup>
                              {errors.status && <p className="text-danger">{errors.status.message}</p>}
                            </div>
                          </div>
                        </FormGroup>

                        <div className="text-center">
                          <Button className="mt-4" color="primary" type="submit">
                            Modify Task
                          </Button>
                          {/* Optionally, add a Delete button here */}
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SimpleFooter />

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} toggle={toggleSuccessModal}>
        <ModalHeader toggle={toggleSuccessModal}>Success</ModalHeader>
        <ModalBody>
          <p>{success}</p>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ModifyTaskForm;
