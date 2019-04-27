import { NextFunctionComponent, NextContext } from 'next';

type Props = {
    floor: 0 | 1,
};

type Query = {
    floor: string,
}

const queryToProps = (query: Query): Props => {
    switch (query.floor) {
        case '0':
            return { floor: 0 };
        case '1':
            return { floor: 1 };
        default:
            throw new Error("Invalid level");
    }
}

const View: NextFunctionComponent<Props, {}, NextContext<Query>> = props => (
    <main>
        This is level {props.floor}
    </main>
);

View.getInitialProps = async ({ query }) => queryToProps(query);

export default View
