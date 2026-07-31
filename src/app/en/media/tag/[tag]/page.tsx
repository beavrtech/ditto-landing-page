import { createTagRoute } from "@/features/media/pages/tag";

const route = createTagRoute("en");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
