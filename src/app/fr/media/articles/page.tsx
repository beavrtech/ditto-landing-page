import { createArticlesRoute } from "@/features/media/pages/articles";

const route = createArticlesRoute("fr");
export const generateMetadata = route.generateMetadata;
export default route.Page;
