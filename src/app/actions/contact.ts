"use server";

import React from "react";
import { render } from "@react-email/render";
import { contactFormSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import sgMail from "@sendgrid/mail";
import { ContactEmail } from "@/emails/ContactEmail";

interface ContactFormResult {
  success: boolean;
  message: string;
  error?: string;
  id?: string;
}

function hasValidSendGridConfig() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  const isApiKeyValid =
    typeof apiKey === "string" &&
    apiKey.startsWith("SG.") &&
    !apiKey.includes("xxxxx") &&
    !apiKey.includes("your_");

  const isFromEmailValid =
    typeof fromEmail === "string" &&
    !fromEmail.includes("seu-dominio.com") &&
    fromEmail.includes("@");

  return {
    enabled: isApiKeyValid && isFromEmailValid,
    apiKey,
    fromEmail,
  };
}

export async function submitContactForm(
  data: unknown
): Promise<ContactFormResult> {
  try {
    // Validar dados com Zod
    const validatedData = contactFormSchema.parse(data);

    console.log("📨 Server Action: Dados recebidos", {
      name: validatedData.name,
      email: validatedData.email,
      timestamp: new Date().toISOString(),
    });

    // Verificar se DATABASE_URL está configurado
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("xxxxx")) {
      console.error("❌ DATABASE_URL não configurado");
      return {
        success: false,
        message: "Erro ao processar formulário",
        error: "Database não configurado",
      };
    }

    // Salvar no banco de dados
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: "new",
      },
    });

    console.log("✅ Mensagem salva no banco:", {
      id: contact.id,
      email: contact.email,
    });

    // Enviar email com template via SendGrid
    const sendGrid = hasValidSendGridConfig();
    if (sendGrid.enabled) {
      try {
        sgMail.setApiKey(sendGrid.apiKey!);

        const emailTemplate = React.createElement(ContactEmail, {
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
          timestamp: contact.createdAt.toISOString(),
          messageId: contact.id,
        });

        const html = await render(emailTemplate);

        await sgMail.send({
          from: sendGrid.fromEmail!,
          to: process.env.ADMIN_EMAIL || "noreply.developersuport@gmail.com",
          replyTo: validatedData.email,
          subject: `📧 Nova mensagem: ${validatedData.subject}`,
          html,
          text: [
            `Nome: ${validatedData.name}`,
            `Email: ${validatedData.email}`,
            `Assunto: ${validatedData.subject}`,
            "",
            validatedData.message,
          ].join("\n"),
        });

        console.log("✅ Email enviado via SendGrid");
      } catch (emailError) {
        console.error("⚠️ Erro ao enviar email via SendGrid:", emailError);
        // Continua mesmo se email falhar - mensagem já foi salva
      }
    } else {
      console.warn(
        "⚠️ SendGrid desabilitado: configure SENDGRID_API_KEY iniciando com 'SG.' e SENDGRID_FROM_EMAIL com remetente verificado no SendGrid."
      );
    }

    return {
      success: true,
      message: "Mensagem enviada com sucesso! Você receberá uma resposta em breve.",
      id: contact.id,
    };
  } catch (error) {
    console.error("❌ Erro na Server Action:", error);

    if (error instanceof Error && "errors" in error) {
      return {
        success: false,
        message: "Dados inválidos",
        error: String(error),
      };
    }

    return {
      success: false,
      message: "Erro ao enviar mensagem",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
