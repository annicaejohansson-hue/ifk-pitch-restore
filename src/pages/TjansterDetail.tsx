import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Partner from "@/components/Partner";
import PermanentRedirect from "@/components/PermanentRedirect";
import ServiceDetail from "@/components/ServiceDetail";
import {
  getServiceBySlug,
  HEEL_CUP_SERVICE_PATH,
  isLegacyHeelCupSlug,
} from "@/data/tjanster";

const TjansterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLegacyHeelCupSlug(slug)) {
    return <PermanentRedirect to={HEEL_CUP_SERVICE_PATH} />;
  }

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
        <nav aria-label="Brödsmula" className="mb-6 md:mb-10">
          <Link
            to="/tjanster"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            Tillbaka till Tjänster
          </Link>
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
