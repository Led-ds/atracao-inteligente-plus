# API Endpoints - Sistema Atraca

Este documento lista todos os endpoints necessários para o backend do sistema de gestão portuária.

## Base URL
```
http://localhost:8080/api
```

## Autenticação
**Nota:** A autenticação será mantida no frontend por enquanto e não requer endpoints específicos.

---

## 1. Embarcações (Vessels)

### GET /vessels
Lista todas as embarcações com filtros opcionais.

**Query Parameters:**
- `status` (string, opcional): 'scheduled', 'docked', 'departed', 'waiting'
- `type` (string, opcional): 'cargo', 'tourism', 'fishing', 'military', 'service'
- `company` (string, opcional): Nome da empresa
- `dateFrom` (string, opcional): Data início (ISO 8601)
- `dateTo` (string, opcional): Data fim (ISO 8601)
- `page` (number, opcional): Página para paginação
- `limit` (number, opcional): Limite de resultados por página

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "type": "cargo|tourism|fishing|military|service",
    "length": 0,
    "width": 0,
    "draft": 0,
    "arrivalTime": "2024-01-01T10:00:00Z",
    "departureTime": "2024-01-01T18:00:00Z",
    "status": "scheduled|docked|departed|waiting",
    "captain": "string",
    "company": "string",
    "position": 0
  }
]
```

### GET /vessels/:id
Busca embarcação específica por ID.

**Response:** Objeto Vessel

### POST /vessels
Cria nova embarcação.

**Request Body:**
```json
{
  "name": "string",
  "type": "cargo|tourism|fishing|military|service",
  "length": 0,
  "width": 0,
  "draft": 0,
  "arrivalTime": "2024-01-01T10:00:00Z",
  "departureTime": "2024-01-01T18:00:00Z",
  "captain": "string",
  "company": "string"
}
```

**Response:** Objeto Vessel criado

### PUT /vessels/:id
Atualiza embarcação existente.

**Request Body:** Partial<CreateVesselRequest> + campos adicionais:
```json
{
  "status": "scheduled|docked|departed|waiting",
  "position": 0
}
```

**Response:** Objeto Vessel atualizado

### DELETE /vessels/:id
Remove embarcação.

**Response:** 204 No Content

### POST /vessels/:id/dock
Atraca embarcação em posição específica.

**Request Body:**
```json
{
  "position": 0
}
```

**Response:** Objeto Vessel atualizado

### POST /vessels/:id/depart
Libera embarcação do cais.

**Response:** Objeto Vessel atualizado

---

## 2. Gestão do Cais (Dock)

### GET /dock/slots
Lista todos os slots do cais.

**Response:**
```json
[
  {
    "id": "string",
    "start": 0,
    "end": 0,
    "status": "free|occupied|waiting-tide|maintenance",
    "vessel": {
      // Objeto Vessel se ocupado
    }
  }
]
```

### GET /dock/slots/:id
Busca slot específico.

**Response:** Objeto DockSlot

### PUT /dock/slots/:id
Atualiza status do slot.

**Request Body:**
```json
{
  "status": "free|occupied|waiting-tide|maintenance",
  "vesselId": "string" // opcional
}
```

**Response:** Objeto DockSlot atualizado

### GET /dock/occupancy
Dados de ocupação do cais.

**Response:**
```json
{
  "totalSlots": 0,
  "occupiedSlots": 0,
  "freeSlots": 0,
  "maintenanceSlots": 0,
  "waitingTideSlots": 0,
  "occupancyRate": 0.67
}
```

### GET /dock/visualization
Dados para visualização do cais (mesmo que /dock/slots).

### POST /dock/maintenance/:id
Marca slot para manutenção.

**Request Body:**
```json
{
  "maintenanceEnd": "2024-01-01T18:00:00Z" // opcional
}
```

**Response:** Objeto DockSlot atualizado

### DELETE /dock/maintenance/:id
Remove manutenção do slot.

**Response:** Objeto DockSlot atualizado

---

## 3. Dados de Maré (Tide)

### GET /tide/current
Maré atual.

**Response:**
```json
{
  "time": "2024-01-01T10:00:00Z",
  "height": 2.5,
  "type": "high|low"
}
```

### GET /tide/today
Marés do dia atual.

**Response:** Array de objetos TideData

### GET /tide/predictions
Previsões de maré com filtros.

**Query Parameters:**
- `dateFrom` (string, opcional): Data início
- `dateTo` (string, opcional): Data fim
- `type` (string, opcional): 'high', 'low'

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "tides": [
      {
        "time": "2024-01-01T10:00:00Z",
        "height": 2.5,
        "type": "high|low"
      }
    ]
  }
]
```

### GET /tide/next-high
Próxima maré alta.

**Response:** Objeto TideData

### GET /tide/next-low
Próxima maré baixa.

**Response:** Objeto TideData

### GET /tide/weekly
Marés da semana.

**Response:** Array de objetos TidePrediction

---

## 4. Dados Meteorológicos (Weather)

### GET /weather/current
Clima atual.

**Response:**
```json
{
  "temperature": 25,
  "windSpeed": 10,
  "windDirection": "NE",
  "waves": 1.2,
  "visibility": 10,
  "description": "Parcialmente nublado"
}
```

### GET /weather/forecast
Previsão do tempo.

**Query Parameters:**
- `days` (number, opcional): Número de dias (padrão: 7)

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "weather": {
      // Objeto WeatherData
    }
  }
]
```

### GET /weather/alerts
Todos os alertas meteorológicos.

**Response:**
```json
[
  {
    "id": "string",
    "type": "storm|high-waves|strong-winds|fog|low-visibility",
    "severity": "low|medium|high|critical",
    "title": "string",
    "description": "string",
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T18:00:00Z",
    "isActive": true
  }
]
```

### GET /weather/alerts/active
Alertas meteorológicos ativos.

**Response:** Array de objetos WeatherAlert

### POST /weather/alerts/:id/acknowledge
Reconhece alerta meteorológico.

**Response:** 200 OK

### GET /weather/conditions
Condições para navegação.

**Response:**
```json
{
  "suitable": true,
  "conditions": {
    // Objeto WeatherData
  },
  "warnings": ["string"],
  "recommendations": ["string"]
}
```

---

## 5. Agendamentos (Schedules)

### GET /schedules
Lista agendamentos com filtros.

**Query Parameters:**
- `vesselId` (string, opcional): ID da embarcação
- `type` (string, opcional): 'arrival', 'departure'
- `status` (string, opcional): Status do agendamento
- `dateFrom` (string, opcional): Data início
- `dateTo` (string, opcional): Data fim
- `priority` (string, opcional): Prioridade
- `page` (number, opcional): Página
- `limit` (number, opcional): Limite

**Response:**
```json
[
  {
    "id": "string",
    "vesselId": "string",
    "vesselName": "string",
    "type": "arrival|departure",
    "scheduledTime": "2024-01-01T10:00:00Z",
    "estimatedTime": "2024-01-01T10:15:00Z",
    "actualTime": "2024-01-01T10:10:00Z",
    "status": "scheduled|confirmed|delayed|cancelled|completed",
    "notes": "string",
    "dockSlotId": "string",
    "priority": "low|medium|high|urgent"
  }
]
```

### GET /schedules/:id
Busca agendamento por ID.

**Response:** Objeto Schedule

### POST /schedules
Cria novo agendamento.

**Request Body:**
```json
{
  "vesselId": "string",
  "type": "arrival|departure",
  "scheduledTime": "2024-01-01T10:00:00Z",
  "notes": "string",
  "dockSlotId": "string",
  "priority": "low|medium|high|urgent"
}
```

**Response:** Objeto Schedule criado

### PUT /schedules/:id
Atualiza agendamento.

**Response:** Objeto Schedule atualizado

### DELETE /schedules/:id
Remove agendamento.

**Response:** 204 No Content

### GET /schedules/today
Agendamentos de hoje.

**Response:** Array de objetos Schedule

### GET /schedules/upcoming
Próximos agendamentos.

**Query Parameters:**
- `hours` (number, opcional): Próximas horas (padrão: 24)

**Response:** Array de objetos Schedule

### POST /schedules/:id/confirm
Confirma agendamento.

**Response:** Objeto Schedule atualizado

### POST /schedules/:id/delay
Marca agendamento como atrasado.

**Request Body:**
```json
{
  "newEstimatedTime": "2024-01-01T10:30:00Z",
  "reason": "string"
}
```

**Response:** Objeto Schedule atualizado

### POST /schedules/:id/complete
Marca agendamento como concluído.

**Request Body:**
```json
{
  "actualTime": "2024-01-01T10:10:00Z"
}
```

**Response:** Objeto Schedule atualizado

---

## 6. Dashboard

### GET /dashboard/stats
Estatísticas do dashboard.

**Response:**
```json
{
  "vesselsToday": {
    "count": 8,
    "change": "+2 desde ontem"
  },
  "activeSchedules": {
    "count": 12,
    "waitingTide": 3
  },
  "averageDockTime": {
    "hours": 4.2,
    "change": "-0.3h vs média"
  },
  "occupancyRate": {
    "percentage": 67,
    "change": "+5% esta semana"
  }
}
```

### GET /dashboard/alerts
Alertas do sistema.

**Response:**
```json
[
  {
    "id": "string",
    "type": "warning|info|error|success",
    "title": "string",
    "message": "string",
    "timestamp": "2024-01-01T10:00:00Z",
    "isRead": false,
    "priority": "low|medium|high|urgent",
    "source": "weather|vessel|dock|system"
  }
]
```

### GET /dashboard/alerts/unread
Alertas não lidos.

**Response:** Array de objetos Alert

### POST /dashboard/alerts/:id/read
Marca alerta como lido.

**Response:** 200 OK

### POST /dashboard/alerts/read-all
Marca todos os alertas como lidos.

**Response:** 200 OK

### GET /dashboard/summary
Resumo operacional.

**Response:**
```json
{
  "totalVessels": 0,
  "dockedVessels": 0,
  "scheduledArrivals": 0,
  "scheduledDepartures": 0,
  "maintenanceSlots": 0,
  "weatherAlerts": 0,
  "systemAlerts": 0
}
```

### GET /dashboard/recent-activity
Atividades recentes.

**Response:**
```json
[
  {
    "id": "string",
    "type": "arrival|departure|dock|maintenance|alert",
    "description": "string",
    "timestamp": "2024-01-01T10:00:00Z",
    "vesselName": "string",
    "location": "string"
  }
]
```

---

## Códigos de Resposta HTTP

- **200 OK**: Sucesso
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Sucesso sem conteúdo (delete)
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Não autorizado
- **403 Forbidden**: Acesso negado
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito de dados
- **422 Unprocessable Entity**: Dados válidos mas processamento impossível
- **500 Internal Server Error**: Erro interno do servidor

## Regras de Negócio

### Embarcações
1. Embarcação não pode ser atracada se não houver slot disponível
2. Embarcação deve ter calado compatível com a maré atual
3. Apenas uma embarcação por slot
4. Validar conflitos de horário no mesmo slot

### Cais
1. Slots em manutenção não podem receber embarcações
2. Posição deve estar dentro dos limites do cais (0-90m)
3. Validar sobreposição de embarcações

### Agendamentos
1. Não permitir agendamentos em horários passados
2. Validar disponibilidade de slot no horário agendado
3. Considerar restrições de maré para embarcações com calado alto
4. Alertar sobre conflitos de agendamento

### Maré
1. Calcular compatibilidade entre calado da embarcação e altura da maré
2. Alertar sobre janelas de maré inadequadas
3. Considerar margem de segurança para operações

### Clima
1. Alertar sobre condições adversas para navegação
2. Restringir operações em condições climáticas perigosas
3. Considerar visibilidade mínima para operações