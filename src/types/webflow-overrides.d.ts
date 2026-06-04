// Extend FormForm to accept Webflow's non-standard 'redirect' prop
import "react";

declare module "react" {
  interface FormHTMLAttributes<T> {
    redirect?: string;
  }
}
