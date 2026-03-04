'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/validations';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ContactFormHF() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        setSuccess(true);
        resetForm();
        toast.success('Recebemos seu projeto com sucesso!', {
          description: 'Retorno inicial em até 24h úteis com próximos passos.',
        });
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(result.error || result.message);
        toast.error('Não conseguimos registrar sua solicitação', {
          description: result.error || result.message || 'Tente novamente em instantes para receber sua proposta.',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem. Tente novamente.';
      setError(
        message
      );
      toast.error('Falha no envio da solicitação', {
        description: `${message} Se preferir, tente novamente em alguns segundos.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10" aria-busy={isSubmitting}>
      <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-sm text-blue-900">
        Resposta média em até 24h úteis. Envie os detalhes e receba uma proposta clara para o seu projeto.
      </div>

      {success && (
        <div role="status" aria-live="polite" className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Mensagem enviada!</h3>
            <p className="text-sm text-green-700 mt-1">
              Você receberá uma resposta em breve no seu email.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Erro ao enviar</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            disabled={isSubmitting}
            {...register('name')}
            className={errors.name ? 'border-red-500 bg-white/90' : 'bg-white/90 border-slate-300 focus-visible:ring-blue-500/25'}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu-email@example.com"
            disabled={isSubmitting}
            {...register('email')}
            className={errors.email ? 'border-red-500 bg-white/90' : 'bg-white/90 border-slate-300 focus-visible:ring-blue-500/25'}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Assunto *</Label>
        <Input
          id="subject"
          placeholder="Ex: Site institucional para clínica"
          disabled={isSubmitting}
          {...register('subject')}
          className={errors.subject ? 'border-red-500 bg-white/90' : 'bg-white/90 border-slate-300 focus-visible:ring-blue-500/25'}
        />
        {errors.subject && (
          <p className="text-red-500 text-sm">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          placeholder="Descreva seu projeto, objetivo e prazo desejado"
          rows={6}
          disabled={isSubmitting}
          {...register('message')}
          className={errors.message ? 'border-red-500 bg-white/90' : 'bg-white/90 border-slate-300 focus-visible:ring-blue-500/25'}
        />
        <p className="text-xs text-gray-600">
          Dica: informe objetivo, prazo estimado e páginas/funcionalidades principais.
        </p>
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gap-2 py-3 text-base font-semibold bg-blue-700 hover:bg-blue-800"
      >
        {isSubmitting ? (
          <>
            <Loader size={16} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Mail size={16} />
            Enviar Mensagem
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Seus dados são protegidos e usados apenas para contato comercial.
      </p>
    </form>
  );
}
