import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Clock, CheckCircle, AlertTriangle, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleListProps {
  onEditSchedule: (schedule: any) => void;
}

export default function ScheduleList({ onEditSchedule }: ScheduleListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data - seria substituído por dados da API
  const schedules = [
    {
      id: '1',
      vesselName: 'Turismo Mar Azul',
      vesselType: 'tourism',
      type: 'arrival',
      scheduledTime: '2024-01-15T09:30:00',
      estimatedTime: '2024-01-15T09:30:00',
      status: 'confirmed',
      priority: 'medium',
      draft: 2.1,
      captain: 'João Silva',
      company: 'Turismo Azul Ltda'
    },
    {
      id: '2',
      vesselName: 'Cargueiro Santos',
      vesselType: 'cargo',
      type: 'arrival',
      scheduledTime: '2024-01-15T11:00:00',
      estimatedTime: '2024-01-15T11:15:00',
      status: 'waiting-tide',
      priority: 'high',
      draft: 4.2,
      captain: 'Maria Costa',
      company: 'Santos Shipping'
    },
    {
      id: '3',
      vesselName: 'Pesqueiro Oceano',
      vesselType: 'fishing',
      type: 'departure',
      scheduledTime: '2024-01-15T14:15:00',
      status: 'scheduled',
      priority: 'low',
      draft: 3.8,
      captain: 'Pedro Oliveira',
      company: 'Pesca Oceânica'
    },
    {
      id: '4',
      vesselName: 'Militar Patrulha',
      vesselType: 'military',
      type: 'arrival',
      scheduledTime: '2024-01-15T16:00:00',
      status: 'delayed',
      priority: 'urgent',
      draft: 3.2,
      captain: 'Comandante Lima',
      company: 'Marinha do Brasil'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'waiting-tide':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'scheduled':
        return 'Agendado';
      case 'waiting-tide':
        return 'Aguardando Maré';
      case 'delayed':
        return 'Atrasado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'waiting-tide':
        return <AlertTriangle className="h-4 w-4" />;
      case 'delayed':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-blue-600 text-white';
      case 'low':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getVesselTypeLabel = (type: string) => {
    const labels = {
      cargo: 'Carga',
      tourism: 'Turismo',
      fishing: 'Pesca',
      military: 'Militar',
      service: 'Serviço'
    };
    return labels[type] || type;
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.captain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    const matchesType = typeFilter === 'all' || schedule.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por embarcação, empresa ou capitão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="waiting-tide">Aguardando Maré</SelectItem>
            <SelectItem value="delayed">Atrasado</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="arrival">Chegada</SelectItem>
            <SelectItem value="departure">Partida</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Embarcação</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Operação</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Calado</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{schedule.vesselName}</div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getVesselTypeLabel(schedule.vesselType)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {schedule.type === 'arrival' ? 'Chegada' : 'Partida'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {format(new Date(schedule.scheduledTime), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                    {schedule.estimatedTime && schedule.estimatedTime !== schedule.scheduledTime && (
                      <div className="text-sm text-muted-foreground">
                        Est: {format(new Date(schedule.estimatedTime), 'HH:mm', { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(schedule.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(schedule.status)}
                    {getStatusLabel(schedule.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(schedule.priority)}>
                    {schedule.priority === 'low' ? 'Baixa' :
                     schedule.priority === 'medium' ? 'Média' :
                     schedule.priority === 'high' ? 'Alta' : 'Urgente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono">{schedule.draft}m</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditSchedule(schedule)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      {schedule.status === 'scheduled' && (
                        <DropdownMenuItem>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar
                        </DropdownMenuItem>
                      )}
                      {schedule.status === 'confirmed' && (
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          Marcar Atraso
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
        </div>
      )}
    </div>
  );
}