import { createVideosRoute } from "@/features/media/pages/videos";

const route = createVideosRoute("fr");
export const generateMetadata = route.generateMetadata;
export default route.Page;
