import React from 'react';

export class ContainerView extends React.Component {
    fetchData = () => {
        return this.props.containerFetchData(this.props.container.id);
    };

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <div>
                ContainerView
                {this.props.container.data ? (
                    <div>
                        {this.props.container.id}
                    </div>
                ) : null}
            </div>
        );
    }
}