import ErrorPage from "../components/ErrorPage";
import errorImg from "../assets/img/403-Error.png";

export default function Error403() {
    return <ErrorPage code="403" description="Forbidden: Akses ditolak." image={errorImg} />
}
