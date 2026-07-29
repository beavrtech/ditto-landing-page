import { createThemeRoute } from "@/features/media/pages/theme";

const route = createThemeRoute("fr");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
