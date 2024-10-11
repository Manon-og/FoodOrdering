import React from 'react';
import { Modal, Button } from 'react-bootstrap';


interface CustomAlertProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ show, onClose, message }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ color: 'green', fontWeight: 'bold', fontSize: '16px' }}>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomAlert;