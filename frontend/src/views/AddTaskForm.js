import React, { useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
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
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
  endDate: Yup.date()
    .required('End date is required')
    .typeError('Invalid date')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  status: Yup.string().required('Status is required'),
  candidatId: Yup.string().required('Candidat ID is required'),
});

const AddTaskForm = ({ currentUser }) => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: 'Pending'
    }
  });

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userID = storedUser._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();
  const mainRef = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    // Fetch candidates from API
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user');
        const emailsData = response.data.response;
        setCandidates(emailsData);
        console.log(emailsData.response);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchCandidates();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        userId: userID,
        candidateId: data.candidatId
      };
      console.log('form data submitted:', formData)
      
      await axios.post('http://localhost:5000/taches/create', formData);
      
      // Show success modal
      setIsModalOpen(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/list-task');
      }, 2000);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
                  <h3>Add Task</h3>
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Title Field */}
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">Title</div>
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
                        {/* Description Field */}
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">Description</div>
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
                        {/* Start Date Field */}
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">Start Date</div>
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
                        {/* End Date Field */}
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">End Date</div>
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
                        {/* Status Field */}
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">Status</div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="status"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Status" type="select">
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
                        {/* Candidat ID Field */}
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">Candidat </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="candidatId"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Select Candidat ID" type="select">
                                      <option value="">--Select a candidate--</option>
                                      {candidates.map(candidate => (
                                        <option key={candidate._id} value={candidate._id}>
                                          {candidate.email}
                                        </option>
                                      ))}
                                    </Input>
                                  )}
                                />
                              </InputGroup>
                              {errors.candidatId && <p className="text-danger">{errors.candidatId.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        {/* Submit Button */}
                        <div className="text-center">
                          <Button className="mt-4" color="primary" type="submit">
                            Add Task
                          </Button>
                        </div>
                      </Form>
                      <Modal isOpen={isModalOpen} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}>Success</ModalHeader>
                        <ModalBody>
                          Task added successfully!
                        </ModalBody>
                      </Modal>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default AddTaskForm;
