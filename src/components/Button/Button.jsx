import { string, func} from 'prop-types'

const Button = props => {

    const {
        type,
        loadMore,
    } = props;
    
    return (
    
        <button
            className="Button"
            type={type}
            onClick={loadMore}
            aria-label="load more images"
        >Load More
        </button>
    )
};

Button.defaultProps = {
type: "button",
}

Button.propTypes = {
    type: string,
    loadMore: func.isRequired
};

export { Button };