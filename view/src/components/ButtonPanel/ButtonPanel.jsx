import React, { Component } from 'react';
import Button from '../shared/Button/Button'
import './ButtonPanel.css';
import AddCaseReportButton from "../AddCaseReportButton/AddCaseReportButton";


class ButtonPanel extends Component {
    render() {
        return (
	        <div id='buttonPanel'>
	            <Button text='Find case reports' icon={['far', 'search']}/>
	            <Button text='Explore the repository' icon={['far', 'folder-open']}/>
	            <AddCaseReportButton />
	            <Button text='Help' id='helpButton' icon={['far', 'mitten']}/>
	        </div>
	    );
    }
}

export default ButtonPanel;