import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { CareersClient } from "./CareersClient";

export const revalidate = 3600;

export default async function CareersPage() {
  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />
        <CareersClient />
        <Footer />
      </main>
    </div>
  );
}
