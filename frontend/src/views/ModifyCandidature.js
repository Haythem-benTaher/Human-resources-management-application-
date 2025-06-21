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
  ModalBody,
  ModalFooter,
} from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

// Define the validation schema
const validationSchema = Yup.object().shape({
  disponibilite: Yup.string().required('Disponibilité is required'),
  cv: Yup.mixed(),
  lettreDeMotivation: Yup.mixed()
});

const ModifyCandidature = () => {
  const { id } = useParams(); // Get the candidature id from the route
  const { handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();
  const [candidature, setCandidature] = useState(null); // State to store the existing candidature data
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Success modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete confirmation modal state
  const mainRef = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    // Fetch the existing candidature data
    const fetchCandidature = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/candidatures/${id}`);
        setCandidature(response.data);
        setValue('disponibilite', response.data.disponibilite);
        // Set file input values manually, if necessary
        // setValue('cv', response.data.cv); // Might require adjustments based on implementation
        // setValue('lettreDeMotivation', response.data.lettreDeMotivation); // Might require adjustments based on implementation
      } catch (error) {
        console.error('Error fetching candidature:', error);
      }
    };

    fetchCandidature();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('disponibilite', data.disponibilite || '');

    if (data.cv && data.cv.length > 0) {
      formData.append('cv', data.cv[0]); // Append the file object
    }
    if (data.lettreDeMotivation && data.lettreDeMotivation.length > 0) {
      formData.append('lettreDeMotivation', data.lettreDeMotivation[0]); // Append the file object
    }

    try {
      const response = await axios.put(`http://localhost:5000/candidatures/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Success:', response.data);
      setIsSuccessModalOpen(true); // Open success modal
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/candidatures/${id}`);
      console.log('Delete success:', response.data);
      navigate('/list-candida');
    } catch (error) {
      console.error('Delete error:', error.response ? error.response.data : error.message);
    }
  };

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const confirmDelete = () => {
    toggleDeleteModal(); // Close the confirmation modal
    handleDelete(); // Proceed with deletion
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
                  <h3>Modify Application</h3>
                </div>
                <div className="mt-5 py-5 border-top text-center">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      {candidature && (
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
                                {candidature.cv && (
                                  <p>
                                    <a href={`http://localhost:5000/candidatures/${id}/download/cv`} target="_blank" rel="noopener noreferrer">Download existing CV</a>
                                  </p>
                                )}
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
                                {candidature.lettreDeMotivation && (
                                  <p>
                                    <a href={`http://localhost:5000/candidatures/${id}/download/lettreDeMotivation`} target="_blank" rel="noopener noreferrer">Download existing Motivation Letter</a>
                                  </p>
                                )}
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
                              Save changes
                            </Button>
                            <Button className="mt-4 ml-3" color="danger" onClick={toggleDeleteModal}>
                              Delete
                            </Button>
                          </div>
                        </Form>
                      )}
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
          The application has been successfully updated.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { toggleSuccessModal(); navigate('/Offres-page'); }}>
            OK
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this application?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Yes, delete it
          </Button>{' '}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModifyCandidature;
