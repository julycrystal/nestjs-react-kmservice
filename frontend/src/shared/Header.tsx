import { Helmet } from "react-helmet";

interface IHeaderProps {
    title: string;
    description: string;
}
const Header = ({ title, description }: IHeaderProps) => {
    return (
        <Helmet>
            <title>KM Blog | {title}</title>
            <meta name="description" content={description} />
        </Helmet>
    )
}

export default Header
