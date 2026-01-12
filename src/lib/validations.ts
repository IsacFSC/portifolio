import { z } from "zod";

// Função para sanitizar entrada contra XSS e injeção
const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>\"']/g, (char) => {
      const entities: { [key: string]: string } = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
      };
      return entities[char] || char;
    });
};

// Validações Zod com proteção contra ataques
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres")
    .transform(sanitizeString)
    .refine(
      (name) => /^[a-záéíóúàâêãõñçA-ZÁÉÍÓÚÀÂÊÃÕÑÇ\s'-]+$/.test(name),
      "Nome contém caracteres inválidos"
    ),
  
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email não pode exceder 255 caracteres")
    .toLowerCase()
    .refine(
      (email) => !email.includes("script") && !email.includes("javascript"),
      "Email contém caracteres suspeitos"
    ),
  
  subject: z
    .string()
    .min(5, "Assunto deve ter no mínimo 5 caracteres")
    .max(200, "Assunto não pode exceder 200 caracteres")
    .transform(sanitizeString)
    .refine(
      (subject) => !/[\<\>\;\\]/g.test(subject),
      "Assunto contém caracteres suspeitos"
    ),
  
  message: z
    .string()
    .min(10, "Mensagem deve ter no mínimo 10 caracteres")
    .max(5000, "Mensagem não pode exceder 5000 caracteres")
    .transform(sanitizeString)
    .refine(
      (msg) => !msg.toLowerCase().includes("script"),
      "Mensagem contém código suspeito"
    )
    .refine(
      (msg) => !msg.includes("--") && !msg.includes("';") && !msg.includes(";--"),
      "Mensagem contém padrão de SQL injection"
    ),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
