"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Ditto helped us increase our EcoVadis score by 15 points in just 3 months. The AI-powered questionnaire automation saved us weeks of work.",
    quoteFr:
      "Ditto nous a aidé à augmenter notre score EcoVadis de 15 points en seulement 3 mois. L'automatisation des questionnaires par IA nous a fait gagner des semaines.",
    name: "Marie Dupont",
    title: "CSR Director",
    titleFr: "Directrice RSE",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote:
      "The dedicated coach made all the difference. We went from struggling with ISO 14001 to being fully certified in record time.",
    quoteFr:
      "Le coach dédié a fait toute la différence. Nous sommes passés de difficultés avec l'ISO 14001 à une certification complète en un temps record.",
    name: "Jean Martin",
    title: "Operations Manager",
    titleFr: "Directeur des opérations",
    company: "IndustrialCo",
    rating: 5,
  },
  {
    quote:
      "Ditto's platform simplified our CSRD reporting enormously. What used to take months now takes weeks.",
    quoteFr:
      "La plateforme Ditto a énormément simplifié notre reporting CSRD. Ce qui prenait des mois ne prend désormais que quelques semaines.",
    name: "Sophie Laurent",
    title: "Sustainability Lead",
    titleFr: "Responsable développement durable",
    company: "RetailGroup",
    rating: 5,
  },
  {
    quote:
      "The supplier engagement tools helped us map and improve sustainability across our entire supply chain.",
    quoteFr:
      "Les outils d'engagement fournisseurs nous ont permis de cartographier et d'améliorer la durabilité sur l'ensemble de notre chaîne d'approvisionnement.",
    name: "Pierre Bernard",
    title: "Procurement Director",
    titleFr: "Directeur des achats",
    company: "ManufacturePro",
    rating: 5,
  },
  {
    quote:
      "We improved our CDP score from C to A- in one cycle using Ditto's guided reporting workflow.",
    quoteFr:
      "Nous avons amélioré notre score CDP de C à A- en un seul cycle grâce au workflow de reporting guidé de Ditto.",
    name: "Claire Moreau",
    title: "Environmental Manager",
    titleFr: "Responsable environnement",
    company: "EnergyPlus",
    rating: 5,
  },
  {
    quote:
      "An incredibly intuitive platform. Our team adopted it immediately and we saw results within the first month.",
    quoteFr:
      "Une plateforme incroyablement intuitive. Notre équipe l'a adoptée immédiatement et nous avons vu des résultats dès le premier mois.",
    name: "Antoine Leroy",
    title: "CEO",
    titleFr: "PDG",
    company: "GreenStartup",
    rating: 5,
  },
];

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-center mb-12">
          {t("title")}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-border bg-ivory p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow text-yellow"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed flex-1 mb-4">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {/* Avatar placeholder */}
                <div className="h-10 w-10 rounded-full bg-purple-light flex items-center justify-center text-purple text-sm font-semibold">
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.title}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
