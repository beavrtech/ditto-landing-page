// Extend form elements to accept the DevLink export's non-standard 'redirect' prop
import "react";

declare module "react" {
  interface FormHTMLAttributes<T> {
    redirect?: string;
  }
}
