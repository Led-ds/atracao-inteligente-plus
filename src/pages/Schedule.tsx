import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Ship, AlertTriangle } from 'lucide-react';
import ScheduleForm from '@/components/ScheduleForm';
import ScheduleList from '@/components/ScheduleList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Schedule() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const { toast } = useToast();

  // Mock data - seria substituído por chamadas à API
  const scheduleStats = {
    total: 12,
    confirmed: 8,
    waiting: 3,
    delayed: 1
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      // Aqui seria chamado o scheduleService.createSchedule
      console.log('Creating schedule:', scheduleData);
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Agendamento Inteligente
          </h1>
          <p className="text-muted-foreground">
            Gerencie atracações e partidas com validações automáticas
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
            </DialogHeader>
            <ScheduleForm
              schedule={editingSchedule}
              onSubmit={handleCreateSchedule}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingSchedule(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{scheduleStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Ship className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{scheduleStats.confirmed}</p>
                <p className="text-xs text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{scheduleStats.waiting}</p>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{scheduleStats.delayed}</p>
                <p className="text-xs text-muted-foreground">Atrasados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Validações de Calado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="font-medium text-sm">Cargueiro Santos - 11:00</p>
                  <p className="text-xs text-muted-foreground">
                    Calado 4.2m requer maré alta (atual: 3.8m)
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                Aguardando Maré
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Ship className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Turismo Mar Azul - 09:30</p>
                  <p className="text-xs text-muted-foreground">
                    Calado 2.1m compatível (maré atual: 3.8m)
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                Aprovado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleList onEditSchedule={handleEditSchedule} />
        </CardContent>
      </Card>
    </div>
  );
}