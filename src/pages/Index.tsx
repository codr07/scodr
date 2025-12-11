import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactCTA } from "@/components/ContactCTA";
import { Terminal } from "@/components/Terminal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Terminal Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <code className="text-sm text-muted-foreground font-mono">
                <span className="text-primary">$</span> ./explore.sh
              </code>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-primary text-glow">
                Interactive Terminal
              </h2>
              <p className="text-muted-foreground mt-2">Type 'help' to see available commands</p>
            </div>
            <Terminal />
          </div>
        </section>
        
        <SkillsSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
