import { createHomeRoute } from "@/features/media/pages/home";

const route = createHomeRoute("fr");
export const generateMetadata = route.generateMetadata;
export default route.Page;
