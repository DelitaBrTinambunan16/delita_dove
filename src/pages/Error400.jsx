import ErrorPage from "../components/ErrorPage";
import errorImg from "../assets/img/400-Error.png";

export default function Error400() {
    return <ErrorPage code="400" description="Bad Request: Permintaan tidak valid." image={errorImg} />
}
