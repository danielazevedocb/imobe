import Link from "next/link";

import { EmptyState } from "@/app/(painel)/imoveis/_components/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants/property-labels";
import { formatCurrency } from "@/lib/format/currency";
import type { Property } from "@/lib/types/property";

type PropertyListProps = {
  properties: Property[];
};

export function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Link key={property.id} href={`/imoveis/${property.id}`}>
          <Card className="h-full transition-colors hover:border-primary/40">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">
                  {PROPERTY_TYPE_LABELS[property.type]}
                </CardTitle>
                <Badge variant="secondary">
                  {PROPERTY_PURPOSE_LABELS[property.purpose]}
                </Badge>
              </div>
              <CardDescription>
                {property.address_street}
                {property.address_number ? `, ${property.address_number}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                {property.neighborhood} — {property.city}/{property.location}
              </p>
              {(property.purpose === "rent" || property.purpose === "both") && (
                <p>
                  Aluguel: {formatCurrency(property.rent_value)}{" "}
                  {!property.rent_available && (
                    <Badge variant="warning" className="ml-1">
                      Indisponível
                    </Badge>
                  )}
                </p>
              )}
              {(property.purpose === "sale" || property.purpose === "both") && (
                <p>
                  Venda: {formatCurrency(property.sale_value)}{" "}
                  {!property.sale_available && (
                    <Badge variant="warning" className="ml-1">
                      Indisponível
                    </Badge>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
