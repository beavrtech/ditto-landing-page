import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { Frameworks } from "@/components/sections/frameworks";
import { Solutions } from "@/components/sections/solutions";
import { Expertise } from "@/components/sections/expertise";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Newsletter } from "@/components/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Frameworks />
        <Solutions />
        <Expertise />
        <Testimonials />
        <BlogPreview />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
