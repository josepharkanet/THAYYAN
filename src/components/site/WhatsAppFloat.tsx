import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat({
  number = "919544982471",
}: {
  number?: string;
}) {
  return (
    <a
      href={whatsappLink(
        number,
        "Hello Stonic Export! I'm interested in your natural stones.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="wa-pulse fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
