import { createArticlesRoute } from "@/features/media/pages/articles";

const route = createArticlesRoute("en");
export const generateMetadata = route.generateMetadata;
export default route.Page;
