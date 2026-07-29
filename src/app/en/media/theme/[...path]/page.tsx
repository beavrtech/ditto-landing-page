import { createThemeRoute } from "@/features/media/pages/theme";

const route = createThemeRoute("en");
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
