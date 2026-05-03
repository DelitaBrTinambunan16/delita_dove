import ErrorPage from "../components/ErrorPage";
import errorImg from "../assets/img/401-Error.png";

export default function Error401() {
    return <ErrorPage code="401" description="Unauthorized: Anda tidak memiliki akses." image={errorImg} />
}
