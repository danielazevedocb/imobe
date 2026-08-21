import "server-only";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { renderToBuffer } from "@react-pdf/renderer";

import { formatCurrency } from "@/lib/format/currency";
import type { ContractSnapshot } from "@/lib/types/contract";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 4,
  },
  notice: {
    marginTop: 20,
    fontSize: 9,
    color: "#555555",
  },
});

function PartyBlock({
  title,
  party,
}: {
  title: string;
  party: ContractSnapshot["party_a"];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>Nome: {party.name}</Text>
      <Text style={styles.paragraph}>Documento: {party.document}</Text>
      {party.registration ? (
        <Text style={styles.paragraph}>RG/Inscrição: {party.registration}</Text>
      ) : null}
      <Text style={styles.paragraph}>Endereço: {party.address}</Text>
      <Text style={styles.paragraph}>Telefone: {party.phone}</Text>
      <Text style={styles.paragraph}>E-mail: {party.email}</Text>
    </View>
  );
}

function PropertyBlock({ snapshot }: { snapshot: ContractSnapshot }) {
  const { property } = snapshot;
  const address = [
    property.address_street,
    property.address_number,
    property.address_complement,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Imóvel</Text>
      {property.type ? (
        <Text style={styles.paragraph}>Tipo: {property.type}</Text>
      ) : null}
      <Text style={styles.paragraph}>Endereço: {address}</Text>
      <Text style={styles.paragraph}>
        Bairro/Cidade: {property.neighborhood}, {property.city}/{property.location}
      </Text>
    </View>
  );
}

function RentDocument({ snapshot }: { snapshot: ContractSnapshot }) {
  const details = snapshot.rent_details!;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Contrato de Locação Residencial/Comercial</Text>

        <PartyBlock title="Locador(a)" party={snapshot.party_a} />
        <PartyBlock title="Locatário(a)" party={snapshot.party_b} />
        <PropertyBlock snapshot={snapshot} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condições da locação</Text>
          <Text style={styles.paragraph}>
            Vigência: {details.start_date} a {details.end_date}
          </Text>
          <Text style={styles.paragraph}>
            Valor mensal: {formatCurrency(details.rent_amount)}
          </Text>
          <Text style={styles.paragraph}>Vencimento: dia {details.due_day}</Text>
          <Text style={styles.paragraph}>
            Forma de pagamento: {details.payment_method}
          </Text>
          <Text style={styles.paragraph}>Garantia: {details.guarantee_type}</Text>
          {details.guarantee_value ? (
            <Text style={styles.paragraph}>
              Valor da garantia: {formatCurrency(details.guarantee_value)}
            </Text>
          ) : null}
          <Text style={styles.paragraph}>
            Reajuste: {details.adjustment_index}
          </Text>
          <Text style={styles.paragraph}>
            Encargos e responsabilidades: {details.charges_responsibility}
          </Text>
          {details.notes ? (
            <Text style={styles.paragraph}>Observações: {details.notes}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cláusulas operacionais</Text>
          <Text style={styles.paragraph}>
            1. O locatário compromete-se a utilizar o imóvel conforme sua finalidade e
            manter o pagamento do aluguel até a data de vencimento acordada.
          </Text>
          <Text style={styles.paragraph}>
            2. O locador declara estar ciente das informações informadas neste documento
            e responsável pela veracidade dos dados cadastrados.
          </Text>
          <Text style={styles.paragraph}>
            3. As partes reconhecem que este documento é um modelo operacional e não
            substitui assessoria jurídica especializada.
          </Text>
        </View>

        <Text style={styles.notice}>{snapshot.legal_notice}</Text>
      </Page>
    </Document>
  );
}

function SaleDocument({ snapshot }: { snapshot: ContractSnapshot }) {
  const details = snapshot.sale_details!;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Contrato de Compra e Venda de Imóvel</Text>

        <PartyBlock title="Vendedor(a)" party={snapshot.party_a} />
        <PartyBlock title="Comprador(a)" party={snapshot.party_b} />
        <PropertyBlock snapshot={snapshot} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condições da venda</Text>
          <Text style={styles.paragraph}>
            Preço: {formatCurrency(details.sale_price)}
          </Text>
          <Text style={styles.paragraph}>
            Condições de pagamento: {details.payment_terms}
          </Text>
          <Text style={styles.paragraph}>
            Posse/transferência: {details.possession_date}
          </Text>
          <Text style={styles.paragraph}>
            Escritura: {details.deed_responsibility}
          </Text>
          <Text style={styles.paragraph}>
            Tributos: {details.tax_responsibility}
          </Text>
          {details.notes ? (
            <Text style={styles.paragraph}>Observações: {details.notes}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cláusulas operacionais</Text>
          <Text style={styles.paragraph}>
            1. O comprador declara ciência das condições de pagamento e da data prevista
            para posse ou transferência do imóvel.
          </Text>
          <Text style={styles.paragraph}>
            2. O vendedor declara que as informações cadastradas refletem os dados
            informados no momento da geração deste contrato.
          </Text>
          <Text style={styles.paragraph}>
            3. As partes reconhecem que este documento é um modelo operacional e deve
            ser revisado por profissional habilitado quando necessário.
          </Text>
        </View>

        <Text style={styles.notice}>{snapshot.legal_notice}</Text>
      </Page>
    </Document>
  );
}

export async function generateContractPdfBuffer(
  snapshot: ContractSnapshot,
): Promise<Buffer> {
  const document =
    snapshot.contract_type === "rent" ? (
      <RentDocument snapshot={snapshot} />
    ) : (
      <SaleDocument snapshot={snapshot} />
    );

  return renderToBuffer(document);
}
