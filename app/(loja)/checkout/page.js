import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import CheckoutForm from "./CheckoutForm";

export default async function PaginaCheckout() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar?proximo=/checkout");
  }

  return <CheckoutForm />;
}
