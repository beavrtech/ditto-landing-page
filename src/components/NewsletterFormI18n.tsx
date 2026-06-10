/**
 * Hero "Get Started" form (i18n copy of the DevLink NewsletterForm).
 *
 * On submit: stores the email locally (the contact page's HubSpot form
 * pre-fills from it), notifies Slack via /api/lead, and navigates to the
 * localized get-started page.
 */
"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";
import Block from "../../devlink/modules/Basic/components/Block";
import FormForm from "../../devlink/modules/Form/components/FormForm";
import FormTextInput from "../../devlink/modules/Form/components/FormTextInput";
import FormWrapper from "../../devlink/modules/Form/components/FormWrapper";
import { localizedHref } from "../lib/localized-paths";

/**
 * Props for {@link NewsletterForm}
 */
export type NewsletterFormProps = {};

export function NewsletterForm({}: NewsletterFormProps) {
  const t = useTranslations("newsletterForm");
  const locale = useLocale();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const input = inputRef.current;
    const email = input?.value.trim() ?? "";
    if (!email || !input?.checkValidity()) {
      input?.reportValidity();
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      localStorage.setItem("userEmail", email);
    } catch {}

    // Fire-and-forget Slack notification; keepalive survives the navigation
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, page: window.location.pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {}

    router.push(localizedHref("/get-started", locale));
  }

  return (
    <div
      className={DEVLINK_SCOPE_CLASS}
      style={{
        display: "contents",
      }}
    >
      <FormWrapper className={"newsletter_form_wrapper"}>
        <FormForm
          className={"newsletter_form"}
          data-name={"email-form"}
          id={"wf-form-email-form"}
          name={"wf-form-email-form"}
          onSubmit={handleSubmit}
        >
          <Block className={"newsletter_input_wrapper"} tag={"div"}>
            <FormTextInput
              autoFocus={false}
              className={"newsletter_input"}
              data-name={"email"}
              disabled={false}
              id={"email"}
              maxLength={256}
              name={"email"}
              placeholder={"name@company.com"}
              required={true}
              type={"email"}
              ref={inputRef}
            />
            <Block
              className={"button"}
              id={"submit-button"}
              tag={"div"}
              onClick={() => handleSubmit()}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <Block tag={"div"}>{submitting ? "…" : t("button")}</Block>
            </Block>
          </Block>
        </FormForm>
      </FormWrapper>
    </div>
  );
}
