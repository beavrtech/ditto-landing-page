import { createAuthorRoute } from "@/features/media/pages/author";

const route = createAuthorRoute("fr");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
