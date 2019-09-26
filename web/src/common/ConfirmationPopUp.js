import React, {Component} from 'react';
import {Button, Modal, Icon} from 'semantic-ui-react';


class ConfirmationPopUp extends Component {

    onYes = () => {
        this.props.onYes();
    };

    onCancel = () => {
        this.props.close();
    };

    render() {
        const {
            isOpen,
            headerName,
            headerMessage,
            message,
            textColor,
        } = this.props;


        return (
            <div>
                <Modal open={isOpen} size="small" className='confirm-popup'>
                    <Modal.Header>
                        <Button
                            className='close-btn'
                            style={{float: 'right'}}
                            onClick={this.onCancel}
                        >
                            <Icon size='large' name="remove"/>
                        </Button>

                        {headerName}
                    </Modal.Header>
                    <Modal.Content>
                        <div className='msg-content'>
                            {headerMessage}
                            <p className="message" style={{color: textColor}}>{message}</p>
                        </div>

                        <div className="pop-up-btns">
                            <Button
                                content='Yes'
                                className='save-btn'
                                style={{float: 'right'}}
                                onClick={this.onYes}
                            />
                            <Button
                                content='No'
                                className='cancel-btn'
                                style={{float: 'right'}}
                                onClick={this.onCancel}
                            />
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default ConfirmationPopUp;
