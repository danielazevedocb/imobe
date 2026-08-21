"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

import { generateContractAction } from "@/app/(painel)/contratos/novo/_actions/generate-contract";
import { PartyFields } from "@/app/(painel)/contratos/novo/_components/party-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ADJUSTMENT_INDEX_OPTIONS,
  GUARANTEE_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/lib/constants/contract-labels";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/constants/property-labels";
import { CONTRACT_LEGAL_NOTICE } from "@/lib/types/contract";
import { buildEmptyPartyDefaults } from "@/lib/utils/contract-party-defaults";
import {
  manualRentContractSchema,
  manualSaleContractSchema,
  type ManualRentContractInput,
  type ManualSaleContractInput,
} from "@/lib/validations/contract-schema";

type ManualContractFormProps = {
  contractType: "rent" | "sale";
};

export function ManualContractForm({ contractType }: ManualContractFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const schema =
    contractType === "rent" ? manualRentContractSchema : manualSaleContractSchema;

  const form = useForm<ManualRentContractInput | ManualSaleContractInput>({
    resolver: zodResolver(schema as never) as Resolver<
      ManualRentContractInput | ManualSaleContractInput
    >,
    defaultValues: {
      idempotency_key: idempotencyKey,
      contract_type: contractType,
      property: {
        type: "apartment",
        address_street: "",
        address_number: "",
        address_complement: "",
        neighborhood: "",
        city: "",
        location: "",
      },
      party_a: buildEmptyPartyDefaults(),
      party_b: buildEmptyPartyDefaults(),
      ...(contractType === "rent"
        ? {
            rent_details: {
              start_date: "",
              end_date: "",
              rent_amount: "",
              due_day: 5,
              payment_method: "pix",
              guarantee_type: "deposit",
              guarantee_value: "",
              adjustment_index: "igpm",
              charges_responsibility:
                "IPTU, condomínio e encargos conforme acordado entre as partes.",
              notes: "",
            },
          }
        : {
            sale_details: {
              sale_price: "",
              payment_terms: "",
              possession_date: "",
              deed_responsibility: "Responsabilidade conforme acordado entre as partes.",
              tax_responsibility: "Tributos conforme legislação aplicável.",
              notes: "",
            },
          }),
    },
  });

  function handleSubmit(
    values: ManualRentContractInput | ManualSaleContractInput,
  ) {
    startTransition(async () => {
      const result = await generateContractAction(values);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as never, { message: messages[0] });
            }
          });
        }
        if (result.message) toast.error(result.message);
        return;
      }

      toast.success("Contrato gerado com sucesso.");
      router.push(`/contratos/${result.data?.id}`);
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <input type="hidden" {...form.register("idempotency_key")} />
        <input type="hidden" {...form.register("contract_type")} />

        <Card>
          <CardHeader>
            <CardTitle>Dados do imóvel</CardTitle>
            <CardDescription>
              Preencha manualmente as informações do imóvel para o contrato.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="property.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do imóvel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="property.address_street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="property.address_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="property.address_complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="property.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="property.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="property.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado/UF</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <PartyFields
          control={form.control}
          prefix="party_a"
          title={contractType === "rent" ? "Locador(a)" : "Vendedor(a)"}
          disabled={isPending}
          addressLabel="Endereço de correspondência"
        />
        <PartyFields
          control={form.control}
          prefix="party_b"
          title={contractType === "rent" ? "Locatário(a)" : "Comprador(a)"}
          disabled={isPending}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              {contractType === "rent"
                ? "Condições da locação"
                : "Condições da venda"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {contractType === "rent" ? (
              <>
                <FormField
                  control={form.control}
                  name="rent_details.start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início da vigência</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim da vigência</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.rent_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do aluguel</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.due_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de vencimento</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="28" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de pagamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_METHOD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.guarantee_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GUARANTEE_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.adjustment_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Índice de reajuste</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ADJUSTMENT_INDEX_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rent_details.charges_responsibility"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Encargos e responsabilidades</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="sale_details.sale_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de venda</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sale_details.possession_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de posse/transferência</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sale_details.payment_terms"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Condições de pagamento</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sale_details.deed_responsibility"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Responsabilidade pela escritura</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sale_details.tax_responsibility"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Responsabilidade pelos tributos</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revisão e aviso legal</CardTitle>
            <CardDescription>{CONTRACT_LEGAL_NOTICE}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Gerando PDF..." : "Gerar contrato em PDF"}
            </Button>
            <Button type="button" variant="outline" asChild disabled={isPending}>
              <Link href="/contratos/novo">Voltar</Link>
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
