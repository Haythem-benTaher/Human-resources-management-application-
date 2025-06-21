import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Container, Row, Col } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DemoNavbar from 'components/Navbars/DemoNavbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import axios from 'axios';

// Validation schema
const validationSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Email is not valid').required('Email is required'),
  phone: Yup.string().required('Phone is required').min(8, 'Phone should be at least 8 characters'),
  role: Yup.string().required('Role is required'),
});

const EditUser = ({ onUserUpdate }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { handleSubmit, control, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      // Simuler une API pour obtenir les données de l'utilisateur
      const fetchedUser = {
        id: parseInt(userId),
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        phone: '123456789',
        role: 'Admin',
      };

      reset(fetchedUser);
    };

    fetchUserData();
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [userId, reset]);

  const onSubmit = async (data) => {
    if (typeof onUserUpdate === 'function') {
      onUserUpdate(data);
    } else {
      console.error('onUserUpdate is not a function');
    }
    navigate('/Profile');
  };

  return (
    <>
      <DemoNavbar />
      <main>
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-7">
            <Row className="justify-content-center">
              <Col lg="6">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form" onSubmit={handleSubmit(onSubmit)}>
                      <h3>Edit User</h3>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-hat-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="firstname"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="First name" autoComplete="off" />
                            )}
                          />
                        </InputGroup>
                        {errors.firstname && <span className="text-danger">{errors.firstname.message}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-hat-3" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="lastname"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Last name" autoComplete="off" />
                            )}
                          />
                        </InputGroup>
                        {errors.lastname && <span className="text-danger">{errors.lastname.message}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="example@gmail.com" autoComplete="off" />
                            )}
                          />
                        </InputGroup>
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-mobile-button" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Phone" autoComplete="off" />
                            )}
                          />
                        </InputGroup>
                        {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-user-run" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Role" autoComplete="off" />
                            )}
                          />
                        </InputGroup>
                        {errors.role && <span className="text-danger">{errors.role.message}</span>}
                      </FormGroup>
                      <div className="text-center">
                        <Button className="mt-4" color="primary" type="submit" >
                          Update User
                        </Button>
                        <Button type="button" color="secondary" className="mt-4 ml-2" onClick={() => navigate('/Profile-page')}>
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default EditUser;
// import React, { useState, useRef, useEffect } from 'react';
// import { Button, Card, Container, Row, Col, Table } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import DemoNavbar from 'components/Navbars/DemoNavbar.js';
// import SimpleFooter from 'components/Footers/SimpleFooter.js';

// const Profile = () => {
//   const [users, setUsers] = useState([
//     { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', phone: '123456789', role: 'Admin' },
//   
//   ]);
//   const navigate = useNavigate();
//   const mainRef = useRef(null);

//   useEffect(() => {
//     document.documentElement.scrollTop = 0;
//     document.scrollingElement.scrollTop = 0;
//     if (mainRef.current) {
//       mainRef.current.scrollTop = 0;
//     }
//   }, []);

//   const editUser = (userId) => {
//     navigate(/edituser/${userId});
//   };

//   const deleteUser = (id) => {
//     setUsers(users.filter((user) => user.id !== id));
//   };

//   const updateUser = (updatedUser) => {
//     setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
//   };

//   return (
//     <>
//       <DemoNavbar />
//       <main className="profile-page" ref={mainRef}>
//         <section className="section-profile-cover section-shaped my-0">
//           <div className="shape shape-style-1 shape-default alpha-4">
//             <span />
//             <span />
//             <span />
//             <span />
//             <span />
//             <span />
//             <span />
//           </div>
//           <div className="separator separator-bottom separator-skew">
//             <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
//               <polygon className="fill-white" points="2560 0 2560 100 0 100" />
//             </svg>
//           </div>
//         </section>
//         <section className="section">
//           <Container>
//             <Card className="card-profile shadow mt--300">
//               <div className="px-4">
//                 <div className="mt-5 py-5 border-top text-center">
//                   <Row className="justify-content-center">
//                     <Col lg="12">
//                       <h3>Users</h3>
//                       <Button color="primary" onClick={() => navigate('/formuser-page')}>
//                         New User
//                       </Button>
//                       <Table bordered>
//                         <thead>
//                           <tr>
//                             <th>#</th>
//                             <th>First Name</th>
//                             <th>Last Name</th>
//                             <th>Email</th>
//                             <th>Phone</th>
//                             <th>Role</th>
//                             <th>Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {users.map((user) => (
//                             <tr key={user.id}>
//                               <th scope="row">{user.id}</th>
//                               <td>{user.firstname}</td>
//                               <td>{user.lastname}</td>
//                               <td>{user.email}</td>
//                               <td>{user.phone}</td>
//                               <td>{user.role}</td>
//                               <td>
//                                 <Button color="info" size="sm" onClick={() => editUser(user.id)}>Edit</Button>
//                                 <Button color="danger" size="sm" onClick={() => deleteUser(user.id)}>Delete</Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </Col>
//                   </Row>
//                 </div>
//               </div>
//             </Card>
//           </Container>
//         </section>
//       </main>
//       <SimpleFooter />
//     </>
//   );
// };

// export default Profile;

