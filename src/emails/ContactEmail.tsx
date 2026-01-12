import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  messageId: string;
}

export const ContactEmail: React.FC<ContactEmailProps> = ({
  name,
  email,
  subject,
  message,
  timestamp,
  messageId,
}) => {
  const formattedDate = new Date(timestamp).toLocaleString("pt-BR");

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Nova mensagem de contato: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>📧 Nova Mensagem de Contato</Text>
          </Section>

          {/* Sender Info */}
          <Section style={infoSection}>
            <Row>
              <Text style={label}>De:</Text>
              <Text style={value}>{name}</Text>
            </Row>
            <Row>
              <Text style={label}>Email:</Text>
              <Text style={value}>
                <Link href={`mailto:${email}`} style={link}>
                  {email}
                </Link>
              </Text>
            </Row>
            <Row>
              <Text style={label}>Data:</Text>
              <Text style={value}>{formattedDate}</Text>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Subject */}
          <Section style={subjectSection}>
            <Text style={subjectText}>{subject}</Text>
          </Section>

          {/* Message */}
          <Section style={messageSection}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={button} href={`mailto:${email}`}>
              Responder
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ID da Mensagem: <code style={code}>{messageId}</code>
            </Text>
            <Text style={footerText}>Enviado em: {formattedDate}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ============================================================================
// Styles
// ============================================================================

const main = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  backgroundColor: "#2563eb",
  borderRadius: "8px 8px 0 0",
  margin: "0",
  padding: "20px",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const infoSection = {
  backgroundColor: "#ffffff",
  borderRadius: "0",
  margin: "0",
  padding: "20px",
  borderBottom: "1px solid #e5e7eb",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  margin: "8px 0 4px 0",
  textTransform: "uppercase" as const,
};

const value = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 12px 0",
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const subjectSection = {
  backgroundColor: "#f0f9ff",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const subjectText = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
};

const messageSection = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const messageText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const ctaSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block" as const,
  width: "fit-content",
  margin: "0 auto",
};

const footer = {
  backgroundColor: "#f9fafb",
  borderRadius: "0 0 8px 8px",
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "4px 0",
};

const code = {
  backgroundColor: "#e5e7eb",
  borderRadius: "4px",
  padding: "2px 6px",
  fontFamily: "monospace",
  fontSize: "12px",
};
