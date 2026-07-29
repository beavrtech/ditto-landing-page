import { createAboutRoute } from "@/features/media/pages/about";

const route = createAboutRoute("fr");
export const generateMetadata = route.generateMetadata;
export default route.Page;
