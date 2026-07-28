import { createArticleRoute } from "@/features/media/pages/article";

const route = createArticleRoute("en");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
