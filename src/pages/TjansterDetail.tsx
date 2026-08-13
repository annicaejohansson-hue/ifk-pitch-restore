import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import Partner from "@/components/Partner";
import ServiceDetail from "@/components/ServiceDetail";
import { getServiceBySlug } from "@/data/tjanster";

const TjansterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    return <Navigate to="/tjanster" replace />;
  }

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-gradient-to-b from-muted/40 to-background">
      <Helmet>
        <title>{service.title} – Caselo Idrottsmedicin</title>
        <meta name="description" content={service.metaDescription} />
      </Helmet>

      <section className="container px-4 py-10 md:py-14">
        <nav className="mb-6 text-sm text-muted-foreground md:mb-10">
          <Link to="/tjanster" className="transition-colors hover:text-primary">
            Tjänster
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="break-words text-foreground">{service.title}</span>
        </nav>

        <div className="mx-auto max-w-5xl">
          <ServiceDetail service={service} />
        </div>
      </section>

      <Partner />
    </main>
  );
};

export default TjansterDetail;
