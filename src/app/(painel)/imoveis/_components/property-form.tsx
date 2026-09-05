"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  commitPropertyCreateAction,
  commitPropertyUpdateAction,
  preparePropertyCreateAction,
  preparePropertyUpdateAction,
} from "@/app/(painel)/imoveis/_actions/property-photo-actions";
import { buildKeptPhotoManifest } from "@/lib/utils/property-photo-manifest";
import {
  PropertyPhotoPicker,
  type PropertyPhotoPickerSnapshot,
  uploadSelectedPropertyPhotos,
} from "@/app/(painel)/imoveis/_components/property-photo-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from "@/components/ui/separator";
import {
  PROPERTY_PURPOSE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "@/lib/constants/property-labels";
import type { ExistingPropertyPhotoState } from "@/lib/types/property-photo";
import type { Property } from "@/lib/types/property";
import {
  propertySchema,
  toPropertyFormDefaults,
  type PropertyFormInput,
} from "@/lib/validations/property-schema";

type PropertyFormProps = {
  mode?: "create" | "edit";
  property?: Property;
  initialPhotos?: ExistingPropertyPhotoState[];
  photosLoadError?: boolean;
};

export function PropertyForm({
  mode = "create",
  property,
  initialPhotos = [],
  photosLoadError = false,
}: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const photoStateRef = useRef<PropertyPhotoPickerSnapshot>({
    keptExisting: initialPhotos,
    newFiles: [],
    totalCount: initialPhotos.length,
    canAddMore: initialPhotos.length < 10,
    errors: [],
  });

  const form = useForm<PropertyFormInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: toPropertyFormDefaults(property),
  });

  const purpose = form.watch("purpose");
  const showRentFields = purpose === "rent" || purpose === "both";
  const showSaleFields = purpose === "sale" || purpose === "both";

  function handleSubmit(values: PropertyFormInput) {
    if (mode === "edit" && photosLoadError) {
      toast.error(
        "Não foi possível carregar as fotos deste imóvel. Recarregue a página antes de salvar.",
      );
      return;
    }

    startTransition(async () => {
      const operationKey = crypto.randomUUID();
      const photoState = photoStateRef.current;

      try {
        if (mode === "edit" && property) {
          const manifest = buildKeptPhotoManifest(photoState.keptExisting);
          const prepareResult = await preparePropertyUpdateAction({
            operationKey,
            propertyId: property.id,
            values,
            photoManifest: manifest,
            expectedPhotoVersion: property.photo_collection_version,
          });

          if (!prepareResult.success) {
            toast.error(prepareResult.message);
            return;
          }

          if (photoState.newFiles.length > 0) {
            await uploadSelectedPropertyPhotos({
              operationId: prepareResult.operationId,
              files: photoState.newFiles,
            });
          }

          const result = await commitPropertyUpdateAction({
            operationKey,
            expectedPhotoVersion: property.photo_collection_version,
            propertyId: property.id,
          });

          if (!result.success) {
            if (result.errors) {
              Object.entries(result.errors).forEach(([field, messages]) => {
                if (messages?.[0]) {
                  form.setError(field as keyof PropertyFormInput, {
                    message: messages[0],
                  });
                }
              });
            }
            toast.error(result.message ?? "Não foi possível salvar o imóvel.");
            return;
          }

          toast.success("Imóvel atualizado com sucesso!");
          router.push(`/imoveis/${result.propertyId}`);
          router.refresh();
          return;
        }

        const prepareResult = await preparePropertyCreateAction(operationKey, values);

        if (!prepareResult.success) {
          toast.error(prepareResult.message);
          return;
        }

        if (photoState.newFiles.length > 0) {
          await uploadSelectedPropertyPhotos({
            operationId: prepareResult.operationId,
            files: photoState.newFiles,
          });
        }

        const result = await commitPropertyCreateAction(operationKey);

        if (!result.success) {
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              if (messages?.[0]) {
                form.setError(field as keyof PropertyFormInput, {
                  message: messages[0],
                });
              }
            });
          }
          toast.error(result.message ?? "Não foi possível cadastrar o imóvel.");
          return;
        }

        toast.success("Imóvel cadastrado com sucesso!");
        router.push(`/imoveis/${result.propertyId}`);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível concluir a operação.",
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Dados do imóvel</h2>
            <p className="text-sm text-muted-foreground">
              Informações básicas de identificação.
            </p>
          </div>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
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
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Endereço</h2>
            <p className="text-sm text-muted-foreground">
              Localização completa do imóvel.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="address_street"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Rua / Logradouro</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua das Flores" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Apto 42" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Localização / Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="SP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listing_url"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Link do anúncio (opcional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Valores</h2>
            <p className="text-sm text-muted-foreground">
              Valores de referência para patrimônio e impostos.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="estimated_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor médio atual (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="350000"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iptu_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPTU (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="1200"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Finalidade</h2>
            <p className="text-sm text-muted-foreground">
              Defina se o imóvel é para aluguel, venda ou ambos.
            </p>
          </div>
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finalidade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a finalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROPERTY_PURPOSE_OPTIONS.map((option) => (
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

          {showRentFields && (
            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="rent_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor mensal de aluguel</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="2500"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rent_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Disponível para locação</FormLabel>
                      <FormDescription>
                        Marque se o imóvel está disponível para alugar.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {showSaleFields && (
            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="sale_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de venda</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="450000"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sale_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Disponível para venda</FormLabel>
                      <FormDescription>
                        Marque se o imóvel está disponível para vender.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
        </section>

        <Separator />

        {photosLoadError ? (
          <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Não foi possível carregar as fotos deste imóvel. Recarregue a página
            antes de salvar alterações.
          </section>
        ) : (
          <PropertyPhotoPicker
            key={property?.id ?? "create"}
            mode={mode}
            initialExisting={initialPhotos}
            disabled={isPending}
            onStateChange={(state) => {
              photoStateRef.current = state;
            }}
          />
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending || photosLoadError}>
            {isPending
              ? "Salvando..."
              : mode === "edit"
                ? "Salvar alterações"
                : "Cadastrar imóvel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
