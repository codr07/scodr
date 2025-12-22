-- Create terminal_commands table
CREATE TABLE terminal_commands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    command TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.terminal_commands ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read commands
CREATE POLICY "Anyone can view terminal commands" 
ON public.terminal_commands 
FOR SELECT 
USING (true);

-- Create user_roles table for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin-only policies for terminal_commands
CREATE POLICY "Admins can insert terminal commands" 
ON public.terminal_commands 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update terminal commands" 
ON public.terminal_commands 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete terminal commands" 
ON public.terminal_commands 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view their own role
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_terminal_commands_updated_at
BEFORE UPDATE ON public.terminal_commands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default help command and some basic commands
INSERT INTO public.terminal_commands (command, description, response) VALUES
('help', 'Display all available commands', 'SYSTEM_HELP'),
('about', 'Learn about Sankha Saha', 'Sankha Saha is a Data Scientist and Full Stack Developer based in Bengaluru. Navigate to /about to learn more.'),
('skills', 'View technical skills', 'Tech Stack: MERN Stack, Data Analytics | Languages: Python, C/CPP, C#, Java, JavaScript, Next.js | DS Tools: Power BI, MatLab, R | Toolkit: GitHub, VS Code, Google Colab'),
('contact', 'Get contact information', 'Email: codr.sankha.contact@gmail.com | Navigate to /contact for the contact form.'),
('blog', 'View the blog', 'Navigate to /blog to read articles on data science, machine learning, and tech.'),
('github', 'View GitHub profile', 'Visit https://github.com/codr07 to see projects and contributions.'),
('linkedin', 'View LinkedIn profile', 'Visit https://linkedin.com/in/sankhasaha to connect professionally.'),
('clear', 'Clear the terminal', 'SYSTEM_CLEAR');