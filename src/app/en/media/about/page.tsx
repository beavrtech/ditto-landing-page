import { createAboutRoute } from "@/features/media/pages/about";

const route = createAboutRoute("en");
export const generateMetadata = route.generateMetadata;
export default route.Page;
