import React, { Component } from 'react';
import TopBar from "../TopBar/TopBar";
import SearchResults from '../SearchResults/SearchResults';
import LoginModal from '../LoginModal/LoginModal';
import axios from 'axios';
import './SearchPage.css';
import { combineMultiWordEntity, allQueriesToTextEntities } from '../../utils';
import { getHost } from '../../utils';
import RelationSearchBar from '../RelationSearchBar/RelationSearchBar';



class SearchPage extends Component {
    state = {
        results: [],                // search results
        textEntities: [],           // predicted entities
        queryText: '',               // query plain text
        allQueries: [{
            queries: ['', ''],
            relations: ['BEFORE']
        }],
    }

    handleTyping = queryText => {
        const _isLetter = c => /^[a-zA-Z()]$/.test(c);
        if (_isLetter(queryText.charAt(queryText.length - 1))) { return }

        // if last typing is not alphabet
        // go over crf API to get entities

        axios.post(getHost() + ":3001/api/getPrediction", {
            data: { query: queryText }
        })
            .then(response => {
                const { data: { entity_types, tokens } } = response;
                const textEntities = combineMultiWordEntity(entity_types, tokens);

                // update state to save current entity tokens
                this.setState({
                    textEntities,
                    queryText
                });
            })
            .catch(error => { console.log(error); });
    }

    handleSearch = () => {
        const { textEntities, queryText } = this.state;
        const queryObj = {
            entities: textEntities,
            query: queryText
        }
        console.log('basic search: ', queryObj);

        axios.post(getHost() + ":3001/api/searchNodes", queryObj)
            .then(res => {
                // search results
                const results = res.data.data.map(info => {
                    return {
                        id: info._source.pmID,
                        entities: info._source.entities,
                        previewText: info._source.content
                    }
                })

                this.setState({ results })
            })
            .catch(err => console.log(err));
    }

    handleSearch3 = () => {
        const { textEntities, queryText, allQueries } = this.state;
        const queryObj = {
            entities: textEntities,
            query: queryText,
            relationQuery: allQueries
        }
        console.log('basic search: ', queryObj);

        axios.post(getHost() + ":3001/api/searchNodesWithRelations", queryObj)
            .then(res => {
                // search results
                console.log(res);
                const results = res.data.data.map(info => {
                    console.log(info.type);
                    if (info.type == "searchNode") {
                        return {
                            id: info._source.pmID,
                            entities: info._source.entities,
                            previewText: info._source.content
                        }
                    } else if (info.type == "relation") {
                        return {
                            id: info.pmID,
                            entities: info.entities,
                            previewText: "info._source.content info._source.content info._source.content info._source.content info._source.content"
                        }
                    }
                })
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i].textEntities);
                }
                this.setState({ results })
            })
            .catch(err => console.log(err));
    }


    handleTyping2 = row => index => e => {
        const query = e.target.value;
        const { allQueries } = { ...this.state };
        const { queries } = allQueries[row];
        queries[index] = query;
        this.setState({ allQueries });
    }

    handleSelect2 = row => index => key => {
        const { allQueries } = { ...this.state };
        const { relations } = allQueries[row];
        relations[index] = key;
        this.setState({ allQueries });
    }

    handleKeyDown2 = e => {
        if (e.key === 'Enter') {
            this.handleRelationSearch();
        }
    }

    handleRelationSearch2 = () => {
        const { allQueries } = this.state;
        console.log(allQueries);
        axios.post(getHost() + ":3001/api/searchMultiRelations", allQueries)
            .then(res => {
                const results = res.data.data.map(info => {
                    console.log(info)
                    return {
                        id: info.pmID,
                        entities: info.entities,
                        previewText: "info._source.content info._source.content info._source.content info._source.content info._source.content"
                    }
                })
                console.log(results);
                this.setState({
                    results
                })
            })
            .catch(err => console.log(err));
    }

    handleAddColumn2 = row => () => {
        const { allQueries } = { ...this.state };
        const { queries, relations } = allQueries[row];
        queries.push('');
        relations.push('BEFORE')
        this.setState({ allQueries });
    }

    handleAddRow2 = () => {
        const { allQueries } = { ...this.state };
        allQueries.push({
            queries: ['', ''],
            relations: ['BEFORE']
        })
        this.setState({ allQueries });
    }

    render() {
        const { results, textEntities, allQueries } = this.state;
        console.log(textEntities);
        return (
            <div id='searchPage'>
                <LoginModal />

                <div id='top-bar-container'>
                    <TopBar
                        textEntities={textEntities}
                        handleSearch={this.handleSearch3}
                        handleAdvancedSearch={this.handleAdvancedSearch}
                        handleTyping={this.handleTyping}
                    />
                    <RelationSearchBar
                        allQueries={this.state.allQueries}
                        handleTyping={this.handleTyping2}
                        handleSelect={this.handleSelect2}
                        handleKeyDown={this.handleKeyDown2}
                        handleRelationSearch={this.handleRelationSearch2}
                        handleAddColumn={this.handleAddColumn2}
                        handleAddRow={this.handleAddRow2}
                    />
                </div>


                {results.length > 0 &&
                    <div id='search-result-container'>
                        <SearchResults
                            results={results}
                            textEntities={textEntities}
                        />
                    </div>
                }

            </div>
        );
    }
}

export default SearchPage;