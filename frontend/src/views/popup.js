import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const popup = ({ isOpen, toggle, message }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>Error</ModalHeader>
    <ModalBody>
      <p>{message}</p>
      <Button color="secondary" onClick={toggle}>Close</Button>
    </ModalBody>
  </Modal>
);

export default popup;
