import PageIntro from "@/components/page-intro";
import PartnerDemo from "@/components/partner-demo";
export const metadata = { title: "For jewellers — Jewellery Hub Nepal" };
export default function Page() {
  return <><PageIntro title={{ en: "Your craft. Your customers.", np: "तपाईंको कला। तपाईंका ग्राहक।" }} description={{ en: "Give your shop a place to be discovered, and customers a direct way to reach you.", np: "आफ्नो पसल चिनाउनुहोस् र ग्राहकलाई तपाईंसम्म सिधै पुग्ने बाटो दिनुहोस्।" }} /><PartnerDemo /></>;
}
