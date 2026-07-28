import { createIndustryRoute } from "@/features/media/pages/industry";

const route = createIndustryRoute("en");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
