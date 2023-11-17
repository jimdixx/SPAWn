import Modal from 'react-bootstrap/Modal';

//[JT] static modal window form
function ModalWindow(props:{header:string|undefined, body:string|undefined, onHide:()=>void}) {
    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={true} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.header}</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
                    {props.body}
                </Modal.Body>

            </Modal>
        </div>
    );
}

export default ModalWindow;