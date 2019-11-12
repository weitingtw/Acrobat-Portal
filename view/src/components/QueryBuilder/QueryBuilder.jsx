import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QueryItem from '../QueryItem/QueryItem';
import Switch from '@material-ui/core/Switch';
import { combineMultiWordEntity } from '../../utils';

import './QueryBuilder.css';


class QueryBuilder extends Component {
    state = {
        showO: true
    }

    handleToggle = () => {
        this.setState(prevState => ({
            showO: !prevState.showO
        }));
    }

    handleEntitySelect = index => type => {
        this.props.handleEntitySelect(index, type);
    }

    render() {
        const { entities } = this.props;
        const { showO } = this.state;

        return (
            <div id='queryBuilder' >

                show type O
                <Switch
                    checked={this.state.showO}
                    onChange={this.handleToggle}
                />

                {
                    entities.map((token, index) => {
                        const { label, type } = token;
                        const handleEntitySelect = this.handleEntitySelect(index);
                        if (type !== 'O' || showO) {
                            return <QueryItem
                                word={label}
                                key={index}
                                type={type}
                                handleEntitySelect={handleEntitySelect}
                            />
                        } else {
                            return null;
                        }
                    })
                }

            </div>
        );
    }
}

QueryBuilder.propTypes = {
    entities: PropTypes.array,
    handleEntitySelect: PropTypes.func
};

// QueryBuilder.defaultProps = {
//     queries: {
//         query1: '',
//         query2: ''
//     }
// };

export default QueryBuilder;