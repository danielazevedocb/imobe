"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useTransition, useEffect, useRef } from "react";
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
import {
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants/property-labels";
import { CONTRACT_LEGAL_NOTICE } from "@/lib/types/contract";
import type { Property } from "@/lib/types/property";
import { resolveInitialPropertyId } from "@/lib/utils/contract-links";
import {
  buildEmptyPartyDefaults,
  buildTenantAddressDefaults,
  formatPropertyAddress,
  getPropertyFinancialDefault,
  type PartyDefaults,
} from "@/lib/utils/contract-party-defaults";
import {
  linkedRentContractSchema,
  linkedSaleContractSchema,
  type LinkedRentContractInput,
  type LinkedSaleContractInput,
} from "@/lib/validations/contract-schema";

type LinkedContractFormProps = {
  contractType: "rent" | "sale";
  properties: Property[];
  initialPropertyId?: string;
  partyBDefaults: PartyDefaults;
};

export function LinkedContractForm({
  contractType,
  properties,
  initialPropertyId,
  partyBDefaults,
}: LinkedContractFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const hasWarnedInvalidPreselection = useRef(false);

  const { propertyId: defaultPropertyId, isPreselectionValid } = useMemo(
    () => resolveInitialPropertyId(properties, initialPropertyId),
    [properties, initialPropertyId],
  );

  const initialProperty = useMemo(
    () => properties.find((property) => property.id === defaultPropertyId),
    [properties, defaultPropertyId],
  );

  const initialFinancialValue = useMemo(
    () => getPropertyFinancialDefault(initialProperty, contractType),
    [initialProperty, contractType],
  );

  useEffect(() => {
    if (
      initialPropertyId &&
      !isPreselectionValid &&
      !hasWarnedInvalidPreselection.current
    ) {
      hasWarnedInvalidPreselection.current = true;
      toast.error(
        "Não foi possível pré-selecionar este imóvel. Selecione manualmente.",
      );
    }
  }, [initialPropertyId, isPreselectionValid]);

  const schema =
    contractType === "rent" ? linkedRentContractSchema : linkedSaleContractSchema;

  const form = useForm<LinkedRentContractInput | LinkedSaleContractInput>({
    resolver: zodResolver(schema as never) as Resolver<
      LinkedRentContractInput | LinkedSaleContractInput
    >,
    defaultValues: {
      idempotency_key: idempotencyKey,
      contract_type: contractType,
      property_id: defaultPropertyId,
      party_a: buildEmptyPartyDefaults(),
      party_b: initialProperty
        ? buildTenantAddressDefaults(initialProperty)
        : partyBDefaults,
      ...(contractType === "rent"
        ? {
            rent_details: {
              start_date: "",
              end_date: "",
              rent_amount:
                initialFinancialValue === ""
                  ? ""
                  : String(initialFinancialValue),
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
              sale_price:
                initialFinancialValue === ""
                  ? ""
                  : String(initialFinancialValue),
              payment_terms: "",
              possession_date: "",
              deed_responsibility: "Responsabilidade conforme acordado entre as partes.",
              tax_responsibility: "Tributos conforme legislação aplicável.",
              notes: "",
            },
          }),
    },
  });

  const selectedPropertyId = form.watch("property_id");
  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId,
  );

  useEffect(() => {
    if (!selectedProperty) return;

    form.setValue("party_b.address", formatPropertyAddress(selectedProperty));

    const financialValue = getPropertyFinancialDefault(
      selectedProperty,
      contractType,
    );

    if (financialValue !== "") {
      if (contractType === "rent") {
        form.setValue("rent_details.rent_amount", String(financialValue));
      } else {
        form.setValue("sale_details.sale_price", String(financialValue));
      }
    }
  }, [selectedProperty, contractType, form]);

  function handleSubmit(
    values: LinkedRentContractInput | LinkedSaleContractInput,
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

  if (properties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum imóvel compatível</CardTitle>
          <CardDescription>
            Cadastre um imóvel com finalidade compatível ou use o preenchimento
            manual.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/imoveis/novo">Cadastrar imóvel</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/contratos/novo/manual?type=${contractType}`}>
              Preencher manualmente
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <input type="hidden" {...form.register("idempotency_key")} />
        <input type="hidden" {...form.register("contract_type")} />

        <Card>
          <CardHeader>
            <CardTitle>Imóvel cadastrado</CardTitle>
            <CardDescription>
              Selecione um imóvel compatível para usar como base do contrato.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imóvel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um imóvel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {PROPERTY_TYPE_LABELS[property.type]} —{" "}
                          {property.address_street}, {property.neighborhood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProperty && (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                <p>
                  <span className="font-medium">Finalidade:</span>{" "}
                  {PROPERTY_PURPOSE_LABELS[selectedProperty.purpose]}
                </p>
                <p>
                  <span className="font-medium">Endereço:</span>{" "}
                  {selectedProperty.address_street}
                  {selectedProperty.address_number
                    ? `, ${selectedProperty.address_number}`
                    : ""}
                </p>
                <p>
                  <span className="font-medium">Cidade:</span>{" "}
                  {selectedProperty.city}/{selectedProperty.location}
                </p>
              </div>
            )}
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
          addressLabel="Endereço do imóvel"
          addressDescription="Preenchido automaticamente com o endereço do imóvel selecionado."
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
          <CardContent>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Gerando PDF..." : "Gerar contrato em PDF"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
