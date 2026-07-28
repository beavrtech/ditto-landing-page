import { createAuthorRoute } from "@/features/media/pages/author";

const route = createAuthorRoute("en");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
