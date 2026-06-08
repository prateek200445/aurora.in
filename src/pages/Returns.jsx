import { BRAND_NAME } from "../utils/constants";
import StaticPageLayout from "../components/StaticPageLayout";

export default function Returns() {
  const sections = [
    {
      text: `At ${BRAND_NAME}, we want you to love your essentials. If you are not completely satisfied with your purchase, we are here to help.`,
    },
    {
      heading: "Returns",
      text: "You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.",
    },
    {
      heading: "Exchanges",
      text: "If you need to exchange an item for a different size or color, please contact our support team. Exchanges are processed free of charge, subject to product availability.",
    },
    {
      heading: "Refunds",
      text: "Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.",
    },
  ];

  return (
    <StaticPageLayout
      pageClass="returns-page"
      title="Return & Exchange Policy"
      sections={sections}
    />
  );
}
