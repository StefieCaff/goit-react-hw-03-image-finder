import { string, func} from 'prop-types'

const Button = props => {

    const {
        text,
        type,
        loadMore,
    } = props;
    
    return (
        <div className="Center-buttons">
            <button
                className="Button"
                type={type}
                onClick={loadMore}
                aria-label={text}
            >{text}
            </button>
        </div>
    )
};

Button.defaultProps = {
    type: "button",
    text: "click me"
}

Button.propTypes = {
    type: string,
    loadMore: func.isRequired,
    text: string
};

export { Button };