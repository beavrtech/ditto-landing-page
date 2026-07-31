import { createTagRoute } from "@/features/media/pages/tag";

const route = createTagRoute("fr");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
