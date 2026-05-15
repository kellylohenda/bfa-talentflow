export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};

export type Program = {
    id: number;
    name: string;
    code: string;
};

export type University = {
    id: number;
    name: string;
};

export type Department = {
    id: number;
    name: string;
};

export type Mentor = {
    id: number;
    name: string;
    email: string;
};

export type Talent = {
    id: number;
    talent_code: string;
    name: string;
    email: string | null;
    kind: 'bolseiro' | 'estagiario';
    status: 'activo' | 'suspenso' | 'concluido' | 'cancelado';
    stipend: string | null;
    perf: number | null;
    risk_score: string | null;
    start_date: string | null;
    end_date: string | null;
    observacoes: string | null;
    program: Program | null;
    university: University | null;
    department: Department | null;
    mentor: Mentor | null;
    created_at: string;
    updated_at: string;
};

export type Application = {
    id: number;
    application_ref: string | null;
    name: string;
    email: string;
    phone: string | null;
    stage: 'analise' | 'entrevista' | 'avaliacao' | 'oferta' | 'convertido' | 'rejeitado';
    tipo: 'bolseiro' | 'estagiario' | null;
    observacoes: string | null;
    program: Program | null;
    university: University | null;
    created_at: string;
    updated_at: string;
};

export type Payment = {
    id: number;
    payment_ref: string;
    period: string;
    amount: string;
    currency: string;
    status: 'pendente' | 'processado' | 'pago' | 'cancelado';
    type: string;
    paid_at: string | null;
    talent: Talent | null;
    created_at: string;
};

export type WorkflowStep = {
    id: number;
    step_number: number;
    approver_role: string;
    decision: 'aprovado' | 'rejeitado' | null;
    comentario: string | null;
    decided_at: string | null;
    approver: Mentor | null;
};

export type Workflow = {
    id: number;
    workflow_code: string;
    type: string;
    status: 'pendente' | 'em_aprovacao' | 'aprovado' | 'rejeitado' | 'cancelado';
    current_step: number;
    total_steps: number;
    descricao: string | null;
    talent: Talent | null;
    steps: WorkflowStep[];
    created_at: string;
};

export type Volunteer = {
    id: number;
    volunteer_code: string;
    nome: string;
    email: string;
    phone: string | null;
    status: 'activo' | 'inactivo' | 'suspenso';
    area_actuacao: string;
    total_horas: string;
    data_inicio: string;
    motivacao: string | null;
    mentor: Mentor | null;
    created_at: string;
};

export type Message = {
    id: number;
    subject: string;
    body: string;
    tipo: string;
    read_at: string | null;
    from: Mentor | null;
    to: Mentor | null;
    created_at: string;
};

export type Document = {
    id: number;
    name: string;
    category: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    storage_path: string | null;
    owner_type: string;
    owner_id: number;
    created_at: string;
};

export type Evento = {
    id: number;
    titulo: string;
    tipo: string;
    formato: string;
    status: string;
    descricao: string | null;
    data_inicio: string;
    data_fim: string | null;
    local: string | null;
    vagas: number | null;
    created_at: string;
};
