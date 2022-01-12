import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IRatingProps {
    value: number;
    color?: string;
}
const Rating = ({ value, color = "#ffd700" }: IRatingProps) => {
    console.log(value);
    return (
        <span>
            <FontAwesomeIcon color={color} icon={value >= 1 ? faStar : value >= 0.5 ? faStarHalfAlt : faStarRegular} />
            <FontAwesomeIcon color={color} icon={value >= 2 ? faStar : value >= 1.5 ? faStarHalfAlt : faStarRegular} />
            <FontAwesomeIcon color={color} icon={value >= 3 ? faStar : value >= 2.5 ? faStarHalfAlt : faStarRegular} />
            <FontAwesomeIcon color={color} icon={value >= 4 ? faStar : value >= 3.5 ? faStarHalfAlt : faStarRegular} />
            <FontAwesomeIcon color={color} icon={value >= 5 ? faStar : value >= 4.5 ? faStarHalfAlt : faStarRegular} />
        </span>
    )
}


export default Rating
