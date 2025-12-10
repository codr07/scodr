import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SkillsSection } from "@/components/SkillsSection";
import { MapPin, GraduationCap, Briefcase, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import profilePhoto from "@/assets/profile-photo.png";

const timeline = [
  {
    year: "2024",
    title: "M.Sc Data Science",
    organization: "Amity University Bengaluru",
    description: "Specializing in Machine Learning and AI applications",
    type: "education",
  },
  {
    year: "2023",
    title: "Co-founder & CTO",
    organization: "EspoZ",
    description: "Building innovative tech solutions for the next generation",
    type: "work",
  },
  {
    year: "2022",
    title: "Google Developer Expert",
    organization: "Google",
    description: "Recognized for contributions to the developer community",
    type: "achievement",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl">
            <code className="text-sm text-muted-foreground font-mono">
              <span className="text-primary">$</span> cat about.md
            </code>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-4 mb-6">
              <span className="text-primary text-glow">About</span>{" "}
              <span className="gradient-text">Me</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm neon-border">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary">
                    <img src={profilePhoto} alt="Sankha Saha" className="w-full h-full object-cover" />
                  </div>
                  
                  <h2 className="font-display text-2xl font-bold text-center text-primary mb-2">
                    Sankha Saha
                  </h2>
                  
                  <p className="text-center text-muted-foreground text-sm mb-6">
                    Data Scientist & Full Stack Developer
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Bengaluru, India</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4 text-secondary" />
                      <span>M.Sc Data Science</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span>Co-founder @EspoZ</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button asChild variant="neon" className="w-full">
                      <a href="https://g.dev/codr07" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Google Developer Profile
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                  <h3 className="font-display text-xl font-semibold text-secondary mb-4">
                    <span className="text-primary">&gt;</span> Hello, World!
                  </h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      I'm a passionate Data Scientist and Full Stack Developer from Kolkata, currently based in Bengaluru. 
                      With a strong foundation in Machine Learning, AI, and modern web technologies, I love building 
                      solutions that make a real impact.
                    </p>
                    <p>
                      My journey in tech started with a curiosity for how things work under the hood. That curiosity 
                      led me to explore everything from neural networks to distributed systems, from frontend frameworks 
                      to cloud infrastructure.
                    </p>
                    <p>
                      When I'm not coding, you'll find me contributing to open-source projects, mentoring aspiring 
                      developers, or exploring the latest in AI research. I believe in continuous learning and sharing 
                      knowledge with the community.
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                  <h3 className="font-display text-xl font-semibold text-secondary mb-6">
                    <span className="text-primary">&gt;</span> Journey
                  </h3>
                  <div className="space-y-6">
                    {timeline.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                            item.type === 'education' ? 'border-secondary bg-secondary/10' :
                            item.type === 'work' ? 'border-primary bg-primary/10' :
                            'border-neon-purple bg-neon-purple/10'
                          }`}>
                            {item.type === 'education' && <GraduationCap className="w-5 h-5 text-secondary" />}
                            {item.type === 'work' && <Briefcase className="w-5 h-5 text-primary" />}
                            {item.type === 'achievement' && <Award className="w-5 h-5 text-neon-purple" />}
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="pb-6">
                          <span className="text-xs font-mono text-primary">{item.year}</span>
                          <h4 className="font-display font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-secondary">{item.organization}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <SkillsSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
