"use server";

import React from "react";
import { contactFormSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { ContactEmail } from "@/emails/ContactEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormResult {
  success: boolean;
  message: string;
  error?: string;
  id?: string;
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

    // Enviar email com template
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_")) {
      try {
        const emailTemplate = React.createElement(ContactEmail, {
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
          timestamp: contact.createdAt.toISOString(),
          messageId: contact.id,
        });

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: process.env.ADMIN_EMAIL || "noreply.developersuport@gmail.com",
          replyTo: validatedData.email,
          subject: `📧 Nova mensagem: ${validatedData.subject}`,
          react: emailTemplate,
        });

        console.log("✅ Email enviado via Resend");
      } catch (emailError) {
        console.error("⚠️ Erro ao enviar email:", emailError);
        // Continua mesmo se email falhar - mensagem já foi salva
      }
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
