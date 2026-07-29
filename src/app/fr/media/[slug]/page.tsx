import { createArticleRoute } from "@/features/media/pages/article";

const route = createArticleRoute("fr");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
