import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { ManifestoClient } from "./ManifestoClient";

export const revalidate = 3600;

export default async function ManifestoPage() {
  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />
        <ManifestoClient />
        <Footer />
      </main>
    </div>
  );
}
