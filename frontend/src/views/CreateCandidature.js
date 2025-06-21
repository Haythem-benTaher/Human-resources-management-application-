import React, { useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
  Modal, // Import Modal component from reactstrap
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

// Define the validation schema
const validationSchema = Yup.object().shape({
  disponibilite: Yup.string().required('Disponibilité is required'),
  cv: Yup.mixed().required('CV is required'),
  lettreDeMotivation: Yup.mixed().required('Lettre de motivation is required')
});

const CreateCandidature = () => {
  const navigate = useNavigate(); 
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { id } = useParams(); // Get offreID from the route
  const storedUser = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
  const userID = storedUser._id; // Extract userID
  const mainRef = useRef(null);

  // Modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, []);

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('disponibilite', data.disponibilite);
      formData.append('cv', data.cv[0]);
      formData.append('lettreDeMotivation', data.lettreDeMotivation[0]);
      formData.append('offreID', id); // Add offreID
      formData.append('userID', userID); // Add userID

      await axios.post('http://localhost:5000/candidatures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show the success modal
      toggleSuccessModal();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
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
                  <h3>Apply for an Application</h3>
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Availability
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="disponibilite"
                                  control={control}
                                  render={({ field }) => (
                                    <Input {...field} placeholder="Enter availability" type="text" />
                                  )}
                                />
                              </InputGroup>
                              {errors.disponibilite && <p className="text-danger">{errors.disponibilite.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              CV
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="cv"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => field.onChange(e.target.files)}
                                    />
                                  )}
                                />
                              </InputGroup>
                              {errors.cv && <p className="text-danger">{errors.cv.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <div className="row">
                            <div className="col-md-6">
                              Motivation Letter
                            </div>
                            <div className="col-md-6">
                              <InputGroup className="input-group-alternative mb-3">
                                <Controller
                                  name="lettreDeMotivation"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => field.onChange(e.target.files)}
                                    />
                                  )}
                                />
                              </InputGroup>
                              {errors.lettreDeMotivation && <p className="text-danger">{errors.lettreDeMotivation.message}</p>}
                            </div>
                          </div>
                        </FormGroup>
                        <div className="text-center">
                          <Button className="mt-4" color="primary" type="submit">
                            Apply now!
                          </Button>
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
          Your application has been successfully submitted!
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => navigate('/Offres-page')}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CreateCandidature;
