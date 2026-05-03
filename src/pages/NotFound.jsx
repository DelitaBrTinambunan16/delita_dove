import ErrorPage from "../components/ErrorPage";
import errorImg from "../assets/img/404-Error.png";

export default function NotFound() {
  return <ErrorPage code="404" description="Not Found: Halaman yang Anda cari tidak tersedia." image={errorImg} />
}