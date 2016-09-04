import React from 'react';
import { ContainerView } from './ContainerView';

export class AppView extends React.Component {
    fetchData = () => {
        return this.props.appFetchData();
    };

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <div>
                AppView
                {this.props.app.data ? (
                    <div>
                        <ContainerView
                            containerFetchData = {this.props.containerFetchData}
                            container = {this.props.containers['test1']}
                        />
                        <ContainerView
                            containerFetchData = {this.props.containerFetchData}
                            container = {this.props.containers['test2']}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}