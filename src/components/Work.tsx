const projects = [
    {
        number: "01",
        title: "E-Commerce Platform",
        category: "Full Stack Development",
        description:
            "A modern e-commerce platform focused on a clean shopping experience and scalable architecture.",
        tech: "Next.js · PostgreSQL · Prisma",
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
    },
    {
        number: "02",
        title: "Dashboard System",
        category: "Web Application",
        description:
            "A data-driven dashboard designed for managing information through a clear and intuitive interface.",
        tech: "React · TypeScript · API",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    },
    {
        number: "03",
        title: "Project Management App",
        category: "Full Stack Development",
        description:
            "A collaborative workspace for managing tasks, tracking progress, and organizing team workflows.",
        tech: "Next.js · PostgreSQL · TypeScript",
        image:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
    },
];

export default function Work() {
    return (
        <section
            id="work"
            className="min-h-screen bg-white px-6 py-24 text-black md:px-12 lg:px-20"
        >
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-24 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-black/40">
                            03
                        </span>

                        <h2 className="text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
                            Work
                        </h2>
                    </div>

                    <p className="max-w-md text-sm leading-relaxed text-black/50 md:text-base">
                        A selection of projects I've built, from web applications to
                        full-stack digital experiences.
                    </p>
                </div>

                {/* Projects */}
                <div className="space-y-24">
                    {projects.map((project) => (
                        <article
                            key={project.number}
                            className="group grid gap-8 border-t border-black/10 pt-6 md:grid-cols-[180px_1fr]"
                        >
                            {/* Meta */}
                            <div className="flex items-start justify-between md:block">
                                <span className="text-sm font-medium text-black/40">
                                    {project.number}
                                </span>

                                <span className="text-xs uppercase tracking-[0.2em] text-black/40 md:mt-6 md:block">
                                    {project.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                                <div>
                                    <h3 className="text-4xl font-medium tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:-translate-x-2 md:text-5xl">
                                        {project.title}
                                    </h3>

                                    <p className="mt-6 max-w-lg text-sm leading-relaxed text-black/50 md:text-base">
                                        {project.description}
                                    </p>

                                    <div className="mt-8 flex items-center gap-4">
                                        <span className="text-xs uppercase tracking-[0.15em] text-black/40">
                                            {project.tech}
                                        </span>

                                        <span className="text-xl transition-transform duration-500 ease-out group-hover:translate-x-2">
                                            →
                                        </span>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
