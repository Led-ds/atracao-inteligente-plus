import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Ship } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const scheduleSchema = z.object({
  vesselName: z.string().min(1, 'Nome da embarcação é obrigatório'),
  vesselType: z.enum(['cargo', 'tourism', 'fishing', 'military', 'service']),
  length: z.number().min(1, 'Comprimento deve ser maior que 0'),
  width: z.number().min(1, 'Largura deve ser maior que 0'),
  draft: z.number().min(0.1, 'Calado deve ser maior que 0'),
  captain: z.string().min(1, 'Nome do capitão é obrigatório'),
  company: z.string().min(1, 'Empresa é obrigatória'),
  type: z.enum(['arrival', 'departure']),
  scheduledTime: z.string().min(1, 'Horário é obrigatório'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleFormProps {
  schedule?: any;
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
}

export default function ScheduleForm({ schedule, onSubmit, onCancel }: ScheduleFormProps) {
  const { toast } = useToast();
  const [currentTide, setCurrentTide] = useState(3.8); // Mock - seria obtido da API
  const [draftValidation, setDraftValidation] = useState<{
    isValid: boolean;
    message: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      vesselName: schedule?.vesselName || '',
      vesselType: schedule?.vesselType || 'cargo',
      length: schedule?.length || 0,
      width: schedule?.width || 0,
      draft: schedule?.draft || 0,
      captain: schedule?.captain || '',
      company: schedule?.company || '',
      type: schedule?.type || 'arrival',
      scheduledTime: schedule?.scheduledTime || '',
      priority: schedule?.priority || 'medium',
      notes: schedule?.notes || '',
    },
  });

  const watchedDraft = form.watch('draft');
  const watchedType = form.watch('vesselType');

  // Validação automática de calado
  useEffect(() => {
    if (watchedDraft > 0) {
      validateDraft(watchedDraft, watchedType);
    }
  }, [watchedDraft, watchedType]);

  const validateDraft = (draft: number, vesselType: string) => {
    const safetyMargin = 0.5; // Margem de segurança de 50cm
    const requiredDepth = draft + safetyMargin;

    if (currentTide >= requiredDepth) {
      setDraftValidation({
        isValid: true,
        message: `Calado aprovado: maré atual ${currentTide}m > necessário ${requiredDepth}m`,
        type: 'success'
      });
    } else if (currentTide >= draft) {
      setDraftValidation({
        isValid: false,
        message: `Atenção: margem de segurança insuficiente. Maré atual: ${currentTide}m`,
        type: 'warning'
      });
    } else {
      setDraftValidation({
        isValid: false,
        message: `Calado rejeitado: maré atual ${currentTide}m < necessário ${requiredDepth}m`,
        type: 'error'
      });
    }
  };

  const handleSubmit = (data: ScheduleFormData) => {
    if (draftValidation && !draftValidation.isValid && draftValidation.type === 'error') {
      toast({
        title: "Validação de Calado",
        description: "Embarcação não pode atracar com maré atual. Aguarde maré alta.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(data);
  };

  const vesselTypeLabels = {
    cargo: 'Carga',
    tourism: 'Turismo',
    fishing: 'Pesca',
    military: 'Militar',
    service: 'Serviço'
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Dados da Embarcação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Dados da Embarcação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vesselName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Embarcação</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cargueiro Santos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vesselType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(vesselTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="captain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capitão</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do capitão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dimensões */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprimento (m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Largura (m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="draft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calado (m)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Validação de Calado */}
            {draftValidation && (
              <div className={`p-3 rounded-lg border ${
                draftValidation.type === 'success' 
                  ? 'bg-green-50 border-green-200'
                  : draftValidation.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {draftValidation.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className={`h-4 w-4 ${
                      draftValidation.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  )}
                  <span className="text-sm font-medium">
                    {draftValidation.message}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Maré atual: {currentTide}m | Próxima maré alta: 15:30 (5.2m)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados do Agendamento */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Operação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="arrival">Chegada</SelectItem>
                        <SelectItem value="departure">Partida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Programado</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(priorityLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações adicionais sobre o agendamento..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {schedule ? 'Atualizar' : 'Criar'} Agendamento
          </Button>
        </div>
      </form>
    </Form>
  );
}